"""Derive the browser host from the exact solar-tested Rhino model, read-only."""
from pathlib import Path
import hashlib
import itertools
import json
import sys

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'tmp/festac-python'))
import rhino3dm as r

HERE = Path(__file__).resolve().parent
SOURCE = ROOT / 'outputs/solar_14d_checkerboard_balcony'
MODEL = SOURCE / '14D_Tower_Checkerboard_Balconies.3dm'
EXPECTED = 'adc2ede89e2690905b5a33f6ac85127ce2d92ca111bbe397d78da85c957c104d'
BLOCK = 'cb66ebe9-67f8-4805-80cf-03c7f6d0eecb'


def point(p):
    return [round(p.X, 8), round(p.Y, 8), round(p.Z, 8)]


def box(obj):
    g = obj.Geometry
    b = g.GetBoundingBox()
    lo, hi = point(b.Min), point(b.Max)
    # Bounds are an exact representation only for these orthogonal box solids.
    assert isinstance(g, r.Brep) and g.IsSolid and len(g.Vertices) == 8 and len(g.Faces) == 6, obj.Attributes.Name
    assert all(face.IsPlanar(1e-7) for face in g.Faces) and all(edge.IsLinear(1e-7) for edge in g.Edges), obj.Attributes.Name
    vertices = [point(v.Location) for v in g.Vertices]
    expected = list(itertools.product(*zip(lo, hi)))
    assert all(any(max(abs(v[i]-p[i]) for i in range(3)) < 1e-7 for p in expected) for v in vertices), obj.Attributes.Name
    return dict(id=str(obj.Attributes.Id), name=obj.Attributes.Name, min=lo, max=hi)


def transformed_bounds(part, matrix):
    pts = []
    for p in itertools.product(*zip(part['min'], part['max'])):
        pts.append([sum(matrix[i][j]*p[j] for j in range(3))+matrix[i][3] for i in range(3)])
    return [[min(p[i] for p in pts) for i in range(3)], [max(p[i] for p in pts) for i in range(3)]]


def main():
    sha = hashlib.sha256(MODEL.read_bytes()).hexdigest()
    assert sha == EXPECTED
    model = r.File3dm.Read(str(MODEL))
    assert model.Settings.ModelUnitSystem == r.UnitSystem.Meters
    geometry = json.loads((SOURCE/'balcony_geometry.json').read_text())
    asset = json.loads((SOURCE/'balcony_asset.json').read_text())
    assert geometry['model_sha256'] == sha
    source_objects = {str(o.Attributes.Id): o for o in model.Objects}
    definition = next(d for d in model.InstanceDefinitions if str(d.Id) == BLOCK)
    parts = [box(source_objects[str(guid)]) for guid in definition.GetObjectIds()]
    assert len(parts) == len(asset['parts']) == 15
    for part, original in zip(parts, asset['parts']):
        assert part['name'] == original['name']
        assert max(abs(part[k][i]-original['bounds'][j][i]) for j,k in enumerate(('min','max')) for i in range(3)) < 1e-7
        part['kind'] = original['kind']
    voxels, context, site = [], [], []
    for obj in model.Objects:
        if obj.Attributes.IsInstanceDefinitionObject or isinstance(obj.Geometry,r.InstanceReference):
            continue
        layer = model.Layers[obj.Attributes.LayerIndex].Name
        voxel_id = obj.Attributes.GetUserString('Voxel ID')
        if voxel_id:
            item = box(obj)
            item['guid'], item['id'] = item['id'], voxel_id
            assert all(abs(item['max'][i]-item['min'][i]-4) < 1e-7 for i in range(3))
            voxels.append(item)
        elif layer in ('14 / White context buildings','14D / Low surrounding buildings'):
            context.append(box(obj))
        elif any(t in layer for t in ('streets','Neighbourhood base','Wider neighbourhood','Public squares')):
            item = box(obj)
            item['layer'] = layer
            site.append(item)
    placements = []
    for p in geometry['placements']:
        obj = source_objects[p['guid']]
        assert str(obj.Geometry.ParentIdefId) == BLOCK
        matrix = p['transform']
        xform = obj.Geometry.Xform
        assert max(abs(matrix[i][j]-getattr(xform,f'M{i}{j}')) for i in range(4) for j in range(4)) < 1e-8
        assert len(p['parts']) == len(parts)
        for part, placed in zip(parts, p['parts']):
            bounds = transformed_bounds(part,matrix)
            assert max(abs(bounds[j][i]-placed['bounds'][j][i]) for j in range(2) for i in range(3)) < 1e-7
        placements.append(dict(id=p['name'],guid=p['guid'],transform=matrix,entryVoxel=p['entry_voxel'],belowVoxel=p['below_voxel'],face=p['face'],bay=p['bay'],level=p['level'],anchor=p['anchor']))
    assert len(voxels) == len({v['id'] for v in voxels}) == 1600
    assert len(context) == 64 and len(placements) == 384
    sample = next(p for p in placements if p['id'] == 'BAL_S_L01_B01')
    assert sample['entryVoxel'] == '2b' and sample['bay'] == 2
    assert [sample['transform'][i][3] for i in range(3)] == [6,-1.5,4]
    payload = dict(schemaVersion=1,units='m',axes='X east, Y north, Z up; assumed model north',towerBounds=[[0,0,0],[32,32,100]],voxels=voxels,context=context,site=site,balconyParts=parts,placements=placements,provenance=dict(model=MODEL.name,sha256=sha,blockId=BLOCK,source='Solar-tested unplanted 14D checkerboard model',north='Scenario assumption; Earth Anchor unset',vegetationIncluded=False,plantedPreview='Visualization only; not a planted solar analysis',context='64 schematic invented neighbourhood building masses',geometry='Exact axis-aligned source box solids and saved instance transforms; open railings retained'))
    js = 'window.TOWER_HOST = '+json.dumps(payload,separators=(',',':'))+';\n'
    (HERE/'host.js').write_text(js,encoding='utf-8')
    report = dict(source_sha256=sha,source_hash_matches=True,units='m',voxel_count=len(voxels),context_buildings=len(context),site_solids=len(site),balcony_occurrences=len(placements),parts_per_balcony=len(parts),box_geometry_verified=True,all_5760_transformed_part_bounds_match=True,all_instance_transforms_match_rhino=True,south_sample=sample,host_js_bytes=len(js.encode()),limitations=['Schematic neighbourhood, not surveyed site','Model north is assumed','Source contains no planting; browser planting has no solar validation'])
    (HERE/'host_validation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,indent=2))


if __name__ == '__main__':
    main()
