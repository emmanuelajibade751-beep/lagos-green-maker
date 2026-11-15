# Approved balcony plant solar analysis

This work compares the 100 catalogue-approved balcony plant studies from their native Blender files with the same solar-tested 14D checkerboard tower. Each stage preserves source geometry, counts, materials and scale. Verified coverage is tracked in the Green Maker solar index.

## Scopes and receivers

- **Single balcony** inserts the selected native study at one original balcony at a time. It uses twelve representative positions, with four façades each at 8, 48 and 88 m. There are 96 original voxel-envelope sensors across 24 exposed faces, and 192 added horizontal deck probes 20 mm above the slab. The deck points have their own architecture-only control. The local result applies to these insertions, including the architectural shade of the other 383 balconies.
- **Whole tower** follows Plant Modeller's exact immutable assembly receipts. Balcony layouts use 384 saved checkerboard occurrences. Wall-mounted grasses and groundcovers use the 800 audited slots on the four vertical façades, including bays without balconies. All whole-tower runs compare 3,456 original 14D exterior sensors and include a 1,600-row volume ledger. Interior cubes have null exposure.
- The wall-growing layer retains its authored position behind the host plane. A façade recess and fixings require design coordination. Stages awaiting a source assembly remain pending.

## Method and constraints

- The architectural source is `../solar_14d_checkerboard_balcony/14D_Tower_Checkerboard_Balconies.3dm`. Both scopes reuse its numbered geometry, source railings and 64 building masses. Mechanical holders and unique supports participate in the planted case. Generic reference deck, rails and study backdrops are removed from the added geometry where identifiable. Audited wall assemblies keep the growing layer and plants, with source reference wall backing and surround excluded.
- Native Blender 5.2 evaluates the selected source geometry in memory. Local rays use Blender BVH or an independently checked equivalent Embree calculation. Whole-tower rays use Embree 4.4 instancing of exact evaluated triangles. The assembly handoff records native visibility, placement and the original visual evidence independently.
- Annual direct geometric sun uses Ladybug SunPath half-hour midpoints in WAT. Incident irradiation uses the same 145-patch Tregenza sky, zero reflected ground radiation, the same time-aligned PVGIS Lagos–Ikeja data and orientation. The native Rhino/Ladybug checkerboard control is the validation reference. The control comparison reports the actual sensor differences. Boundary differences in geometric sun reach half an hour at affected sensors.
- The primary plant and holder calculation assumes opaque, two-sided surfaces. It does not estimate leaf transmission materials, seasonal movement, reflection, evapotranspiration, surface temperature or comfort. An additional hourly PVGIS direct-normal beam diagnostic uses exact time alignment and actual beam directions. It measures only beam energy and is stored separately from the patch-based annual result.
- An unchanged sum across sampled sky patches applies to the sample set. For Silver inch, the added low-angle obstruction received no weighted Tregenza ray at the local envelope samples, while direct geometric sun and the hourly beam diagnostic both showed attenuation. The deck samples and the 384-copy whole-tower scenario answer different questions.

## Review and reproduce

- `approved_sources.json` is the active 100-study manifest. Silver inch has only the approved two-row variant with 26 pots. The superseded one-row trial is excluded.
- `green_maker_solar_index.json` is the app contract. It keys by catalogue plant ID, stage and scope. `cases` holds the local evidence. `plant_modeller_matched` holds verified tower results and immutable assembly provenance. The earlier `whole_tower` directory contains provisional runs.
- `prepare_rays.py` reconstructs the native Ladybug sky and sun directions. `prepare_hourly_beam.py` builds the hourly diagnostic. `analyse_plant_modeller_receipts.py --assembly-index <index>` checks the exact recipes and runs missing cases. `build_green_maker_solar_index.py` refreshes the linked app data and composed evidence images.
- The app data links are relative to the project root. Copy or adapt the completed assets into the release tree without overwriting existing visual studies. Results and rank groups use incident irradiation per exposed m² and preserve all ties within 0.0001 kWh/m²/year. A zero-area voxel has no solar ranking.

[Scope of the full façade clarification](WHOLE_FACADE_PLACEMENT.md) · [Unplanted geometry and weather baseline](../solar_14d_checkerboard_balcony/README.md)
