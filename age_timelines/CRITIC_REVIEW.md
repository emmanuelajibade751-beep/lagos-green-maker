# Independent critic review: age-to-size evidence

Final decision, 14 November 2026: **accept the research register with explicit limits**. All 100 species dispositions and all 300 stage annotations have been reviewed. The current register contains 124 source/cohort records and 264 observations. **21 stages across 13 species have 24 separate conditional height-to-time alternatives; 279 stages remain unassigned. No model has a verified biological age.**

The review is independent of the research extraction and matcher implementation. It includes reopening original papers and institutional accounts, checking table columns and numeric claims, checking clocks and experimental designs, and separately recalculating every current stage disposition against the saved geometry CSV. All numerical series that produce a current conditional match were independently reopened and checked. Context-only records have varying verification depth; the per-species ledger explicitly distinguishes independently checked claims from researcher extractions and access limits. This is a completed review of this register, not an exhaustive search of all botanical literature.

## Matching audit

All 300 measured heights and crown axes agree with Growth_Stage_Measurements.csv. A separate calculation, without importing the producer matcher, reproduced all 21 supported rows and 24 alternatives, including both rising/falling turmeric intervals and separate Crossandra/Casuarina alternatives. No arithmetic mismatch was found. All 300 actual_model_age_min/max values remain null. Each species has exactly stages01/02/03, a source-specific decision, and explicit evidence gaps. Exact target size comparisons do not inflate source means or use design targets.

A conditional interval is the entire interval between compatible reported observations, not a linearly interpolated age, confidence interval or an individual prediction. Different treatments, cultivars, localities, harvest cohorts and stock clocks remain separate. Source records classified context_only or not_usable produce no stage assignments. Mounted plant datums, shoot length, leaf length, stem height, canopy area and volume are not treated as equivalent to soil-rooted plant-top height. No lifespan fraction, annual-rate inversion or ordinal-stage age ordering is imposed.

The pod-bearing pigeon-pea atlas stage02 is expressly excluded. Other dimension analogs remain explicitly unvalidated for flowering, fruiting, branching, root development, container performance and Lagos conditions. In particular, okra stages02/03 and flowering ornamental stages must never be relabelled verified reproductive ages. Casuarina's1-2year alternatives use separately grouped locality examples in a single USDA account; they are not proof of a tracked individual cohort or birth age.

## Corrections and findings closed during review

- Acalypha's experiment is in Abeokuta, Nigeria; publisher location is not trial location.
- Cyperus haspan's undated FWS stature was corrected to15-60cm, exceptionally90cm; it creates no age assignment.
- Clitoria Table2 contains height, while Table3 concerns interception. Separate destructive sections cannot be interpolated as tracked plants.
- Tigernut91cm belongs to12WAP in Results, not the14-week harvest context.
- Typha October2017-February2018 is a nominal four-month monitoring interval, not four weeks or time from germination.
- Ginger cultivar columns were resolved against narrative; Rio de Janeiro values were retained as one treatment series.
- Crossandra's conflicting30DAP control values18.24cm(prose)/18.07cm(table) were omitted. Coix's15/30DAS values duplicating tiller-table numbers were omitted; retained later observations carry source uncertainty.
- Passiflora's7vs10day germination conflict remains explicit context. Snake-plant WAP versus shoot-emergence clock ambiguity remains context. Neem's5vs8year accounts remain separate conflicting evidence.
- Ipomoea pes-caprae quantitative statements were added after the critic found them in full text, but total-height/increment ambiguity prevents model matching. Purslane's numerical regression outputs are explicitly fitted harvest values, not raw longitudinal measurements.
- Incorrect source-type/verification/disposition fields for several event-only or index records were corrected. Retracted roselle evidence was excluded. UTF-8 display corruption was rechecked in the fresh integrated files and is closed.

## Historical nine-series check

The earlier simulator's nine series remain historical context and are not silently imported as calibration. Comparing their27 actual stages yielded no valid assignment from those historical series alone: Acalypha, roselle, Guinea grass, Ceiba and Typha targets exceed source ranges; Croton also has an incompatible stem-height endpoint; the three remaining shoot/vine-length series do not measure model vertical height. Fresh additional research is evaluated independently. Earlier interim pending findings in this critic report are superseded by the final species ledger below.

## Current 100-species disposition ledger

Every row is QUALIFIED_ACCEPT for the stated research scope. A blank conditional-stage cell means all three stages remain unassigned. It does not assert that no usable study exists elsewhere. Full source URLs, gaps, hashes and each of the300 arithmetic outcomes are preserved in review.json; the linked source register gives individual table locators and stock/site/clock details.

| ID | Species | Conditional stages | Critic finding and limitation |
|---|---|---|---|
| LAG-294 | Hibiscus rosa-sinensis | None | Primary control endpoint checked; pruned pre-existing stock and treatment clock. Additional NPK series has DAT/DAP ambiguity. Neither dates propagation. |
| LAG-226 | Acalypha wilkesiana | None | Original table checked; Abeokuta Nigeria location correction retained. Cutting-planting clock and 4-12 cm range cannot date current taller stages. |
| LAG-254 | Codiaeum variegatum | None | Publisher table checked. Stem height on rooted Petra stock is not whole-model foliage height; fertilizer means are not individual bounds. |
| LAG-302 | Ixora coccinea | 01 | Original CT4 before/after values checked. Only broad 0-230 day transplant interval; original stock age unknown and no linear age estimate. |
| LAG-328 | Ocimum gratissimum | 01 | Both spacing rows checked in original table. Separate cohorts retained; only25x20 cm row brackets stage01. Seed sowing and transplant clocks remain distinct. |
| LAG-295 | Hibiscus sabdariffa | None | Yola methods checked but critic table extraction incomplete; researcher checked cells. Added Lagos67DAS endpoint remains separate. No current stage matches; retracted Ghana source excluded. |
| LAG-471 | Cajanus cajan | 01 | Original Table1 checked. Stage01 height analog accepted; pod-bearing02 expressly excluded because source does not establish reproductive timing. |
| LAG-343 | Senna alata | None | NParks six-month flowering event checked. New seedling-length point reviewed as context; does not establish shrub top height or bloom height. |
| LAG-779 | Murraya paniculata | None | Original endpoint38.2cm checked;271DAT after transplant of already six-month stock. No current stage matches. |
| LAG-250 | Clerodendrum paniculatum | None | Original12-week cutting shoot lengths checked. New shoot length is not height of the mother cutting or whole plant. |
| LAG-289 | Gardenia jasminoides | None | RHS maturity category checked; unspecified initial age and general ultimate size prevent longitudinal mapping. |
| LAG-752 | Manihot esculenta | 01, 02 | Three treatment/year table rows independently checked. Stage01 and02 use separate explicit cohorts; no joining years or cultivars into a synthetic curve. |
| LAG-241 | Canna indica | None | Original wetland before/after prose checked:20-25cm to about150cm in six months. Approximate range cannot be converted to a mean; matcher conservatively leaves all stages unassigned. |
| LAG-400 | Abelmoschus esculentus | 01, 02, 03 | Original Table2 complete NH/OK/M height row checked.21st-century field cohort clock retained;02/03 are dimension analogs only, not proof of pod age. |
| LAG-430 | Amaranthus cruentus | 01 | Original Table2 Ikorodu300kg NPK row and4-6WAS clock checked. Vegetative seedling01 matches; no extrapolation to inflorescence stages. |
| LAG-243 | Celosia argentea | None | Original Table3 2018 BH numbers and split-plot harvest treatments checked. Independent first-cut groups and post-cut regrowth must not be a tracked trajectory. |
| LAG-554 | Corchorus olitorius | 01 | Original Table1 PM7.2 row checked. Transplant clock retained; stage01 gets6-8WAT dimension analog, starting seed age remains unspecified. |
| LAG-262 | Costus afer | None | Undated Costus stature reviewed as context. No time-size pairing and no model age. |
| LAG-267 | Curcuma longa | 01, 02, 03 | Original Table4.1A and DAS definition independently recovered. Open-system marginal means include a decline; both90-120 and120-150 alternatives for02 retained. Not an individual trajectory. |
| LAG-1024 | Zingiber officinale | 01 | Original table and narrative checked; left block Rio de Janeiro identified. FinalT2 sequence checked against narrative. Stage01 only120-150DAP height analog. |
| LAG-345 | Spathiphyllum wallisii | None | Original living-wall prose checked. Initial height and minima pooled across treatments; flower height excluded. No valid ontogenetic sequence. |
| LAG-507 | Chlorophytum comosum | None | Publisher abstract independently checked36.87cm at120days. DAT/planting wording and unreported starting stock leave clock and full methods unresolved; context only. |
| LAG-266 | Crossandra infundibuliformis | 02, 03 | Original table/prose independently checked. Conflicting30DAP control18.24vs18.07 excluded. SeparateT10/control alternatives retained; flower-state age remains unknown. |
| LAG-256 | Coleus scutellarioides | None | Original dissertation transcription recovered through alternate host; Wizard10DLI weeks3-7 cells independently checked. Incomplete week8 omitted. No current target in range. |
| LAG-330 | Paspalum vaginatum | None | Mown-turf same-genotype row reviewed. Management height is not undisturbed ontogenetic height; researcher extraction retained as context. |
| LAG-237 | Bambusa vulgaris | None | Institutional clump/culm records reviewed separately. Rhizome clump diameter is not aerial crown diameter, and culm age is not clump age. |
| LAG-366 | Cymbopogon citratus | 02, 03 | Original Table3 white lemongrassT2 numeric pair checked. Red lemongrass is a separate species.4-8month brackets are coarse field analogs, not container calibration. |
| LAG-268 | Cynodon dactylon | None | Mown-turf genotype row reviewed; pruning/mowing invalidates a simple size-age inversion. Context only. |
| LAG-236 | Axonopus compressus | None | Mown-turf genotype row reviewed; canopy height controlled by management. No unmown-model age inferred. |
| LAG-244 | Cenchrus purpureus | None | Regrowth after10cm cut and separate cutting-age groups reviewed. Current record correctly forbids establishment-age interpolation. |
| LAG-319 | Megathyrsus maximus | None | Original Table2 and experimental design checked. Harvest-age treatment groups pooled over spacing are separate observations, not repeated individual growth. |
| LAG-876 | Saccharum officinarum | None | Nursery-sett clock and stressed mangrove field row reviewed. Source size below all current model targets; no extrapolation. |
| LAG-255 | Coix lacryma-jobi | 01, 02 | Original Table4 checked. Early15/30DAS values duplicate tiller columns elsewhere and were excluded.45-75DAS values retained with explicit source uncertainty; no reproductive calibration. |
| LAG-273 | Cyperus papyrus | None | Primary methods checked; wild rhizome stock and acclimation documented. Graph coordinates not extracted; null sizes honest. |
| LAG-269 | Cyperus articulatus | None | Original abstract checked;270DAT harvest and relative21DAT effect are not absolute size-age pairs. |
| LAG-270 | Cyperus esculentus | None | Primary Results3.1 checked:91cm at12WAP, not14-week harvest. Single greenhouse endpoint and no model match. |
| LAG-271 | Cyperus haspan | None | FWS undated size independently corrected to15-60cm, exceptional90cm. No dated size; remains unassigned. |
| LAG-272 | Cyperus ligularis | None | Primary bitstream access failure independently reproduced. No invented numerical extraction. |
| LAG-966 | Telfairia occidentalis | None | PROTA one-week vine lengths checked. Distinct seed-size groups and vine length cannot be compared to canopy elevation. |
| LAG-238 | Basella alba | None | Original75DAS planting-date treatment means checked.26.3-32.9cm is treatment variation, not an individual growth interval. |
| LAG-253 | Clitoria ternatea | None | All11 Table2 means checked; Table3 is interception, not height. Methods explicitly use separately harvested sections after homogenization cut. No chronological individual mapping. |
| LAG-230 | Allamanda cathartica | None | Original Table1 cutting-shoot length and two-week clock checked. New shoot length is not whole-plant height. |
| LAG-258 | Combretum indicum | None | OriginalTable1 sprouting times checked. Abstract reverses hard/soft pattern; conflict preserved and no size attached. |
| LAG-283 | Epipremnum aureum | None | Original scan retrieved but critic text extraction incomplete; researcher recovered dated endpoint on renewed search. Shoot length on treated cuttings remains context only. |
| LAG-651 | Ficus pumila | None | Original abstract checked:juvenile/adult fig cutting types and18-week bud estimates do not supply compatible height-age pairs. |
| LAG-316 | Luffa aegyptiaca | None | PROSEA flowering interval checked. Event/harvest timing does not imply vine canopy height or fruit-stage age. |
| LAG-334 | Piper guineense | None | Independent publisher fetch timeout reproduced. Numeric evidence remains absent rather than estimated. |
| LAG-331 | Passiflora foetida | None | Original sections3.1.1/3.1.2 checked and7vs10day control-germination conflict recorded. Event only, no height or plant-stage age. |
| LAG-301 | Ipomoea pes-caprae | None | Original two-month numeric height/increment statements independently found; researcher added them. Ambiguous increment versus total height and trailing architecture prevent mapping. |
| LAG-479 | Canavalia rosea | None | Flora germination event checked. New publisher nursery stem-length points reviewed as context; neither stem length nor germination event dates installed canopy. |
| LAG-497 | Centella asiatica | None | Original harvest-age experiment checked;4/5/6 are months. Leaf area values are not height; no clonal-patch chronological age inferred. |
| LAG-260 | Commelina diffusa | None | Original thesis confirms flowering after about one month vegetative growth. No linked height; seedling/genet/patch clocks not merged. |
| LAG-709 | Ipomoea batatas | None | Original Table5 and primary-vine base-to-tip method checked. Vine length is not model Z, crown span or clonal occupancy. |
| LAG-769 | Mimosa pudica | None | Original7-day seedlings and3-month soil plants methods checked. Experimental ages without dimensions do not date current geometry. |
| LAG-363 | Heterotis rotundifolia | None | Primary access failure reproduced; no quantitative evidence accepted. |
| LAG-834 | Phyla nodiflora | None | Both source-access failures reproduced. Inaccessible evidence remains a gap, not a zero age. |
| LAG-983 | Tradescantia zebrina | None | Initial host failure reproduced; researcher recovered alternatewww host. January/March/June monitoring of existing stock and shoot length cannot date hanging vertical extent. |
| LAG-324 | Nephrolepis biserrata | None | Original abstract rapid-cover period checked. Cover percentage and8-12WAP schedule lack a paired whole-height value. |
| LAG-787 | Nephrolepis exaltata | None | Original123/133day production durations checked. Growth index or volume is not vertical height; no area/volume inversion. |
| LAG-227 | Acrostichum aureum | None | Original250day spore-to-sporophyte timing checked. Congener216days excluded; event does not date adult fern height. |
| LAG-245 | Ceratopteris cornuta | None | PROSEA entry is primarily C.thalictroides; cornuta comparison does not justify borrowing its chronology. No assignment. |
| LAG-320 | Microsorum scolopendria | None | Institutional source access restricted in critic fetch. Researcher species morphology retained without invented age-size data. |
| LAG-337 | Platycerium stemaria | None | Original proceedings index checked. Shoot-culture multiplication and general staghorn production time do not supply a stemaria height pair; disposition corrected. |
| LAG-325 | Nymphaea lotus | None | Original10WAT serration event checked. Leaf counts and transplant age are not whole plant height. |
| LAG-326 | Nymphaea micrantha | None | Kew vivipary from second year checked. Origin unspecified and no size; schema-field misalignment corrected. |
| LAG-313 | Lasimorpha senegalensis | None | Undated petiole range reviewed; petiole length is not whole-height age evidence. All stage ages remain null. |
| LAG-978 | Thalia geniculata | None | Original thesis prose independently checked1.4m gravel and1.1m PKS within3months. Separate substrates and one-sided attainment time retained; no exact three-month observation invented. |
| LAG-353 | Typha domingensis | None | Original calendar dates and mean heights checked.0-4 nominal months fromOct2017 monitoring, not weeks or birth age. Current heights exceed series. |
| LAG-335 | Pistia stratiotes | None | Original initial adult-rosette diameter14.3cm checked. Diameter with unknown age cannot be a plant-height age pair. |
| LAG-424 | Aloe vera | None | Original240DAP table heights checked. Distinct ecotypes kept separate; no interpolation across treatment maxima. |
| LAG-630 | Dracaena trifasciata | None | Original Table3 numeric row checked. WAP table versus emergence-clock methods conflict preserved; dwarf propagated stock and height metric context only. |
| LAG-310 | Kalanchoe pinnata | None | Original9-day detached-leaf primordium event checked. Plantlet age is not mother-plant age or installed plant height. |
| LAG-410 | Adenium obesum | None | Source accessibility limited for critic; researcher phase descriptions retained as context. No quantitative height chronology asserted. |
| LAG-362 | Portulaca oleracea | None | Original Spanish Results regression and three harvest clocks checked.17.3/29.4/36.8cm are fitted values for0mineralN, not raw longitudinal observations. Context only. |
| LAG-485 | Carica papaya | None | Original pre-transplant27cm and45DAT33.22cm checked. Later insertion heights are not plant-top heights. Current models exceed usable interval. |
| LAG-781 | Musa × paradisiaca | None | Researcher abstract extraction reviewed: three cultivar maxima at32WAP stay separate; pseudostem versus whole-top metric unresolved. Context only. |
| LAG-865 | Ravenala madagascariensis | None | RHS ultimate-size/time category reviewed; unspecified starting stock and broad maturity category cannot date model stages. |
| LAG-082 | Elaeis guineensis | None | Original methods independently checked: measurement to third fully opened leaf and destructive subsampling. This is not maximum crown Z; reported nursery sequence stays context only. |
| LAG-061 | Cocos nucifera | None | Original institutional six/ten-month seedling sizes and40-year mature height checked. Starting age origin unspecified; no division by annual rate. |
| LAG-173 | Raphia hookeri | None | PROTA flowering3-7years after planting checked. Monocarpic stem event differs from clump age; no matching height. |
| LAG-157 | Phoenix reclinata | None | PROTA5m in3-4years example checked. Conditions broad, age origin unspecified; no age inferred for model or clump. |
| LAG-728 | Laguncularia racemosa | None | USDA primary institutional60-90cm after one nursery year independently checked. Nursery residence, not seed/birth age; none of current stages within interval. |
| LAG-552 | Conocarpus erectus | None | Researcher original90-day treatment65.5cm endpoint reviewed; start3-4month saplings retained explicitly. Treatment time does not reset biological age. |
| LAG-105 | Gymnanthemum amygdalinum | None | Researcher original497.5cm endpoint reviewed with30WAP abstract/table versus32WAP methods conflict. Conservative context only. |
| LAG-201 | Terminalia catappa | None | USDA trial mean16m at9years reviewed as stand context; stock/age origin not established, no transfer to planter. |
| LAG-031 | Avicennia germinans | None | PROTA Ghana up-to26cm at4months checked. One-sided upper size is not a closed interval or a universal maximum. |
| LAG-177 | Rhizophora racemosa | None | Restoration plots located by researcher but not digitized. Graph existence does not justify invented numeric pairs. |
| LAG-132 | Mangifera indica | None | Original mango1.91/2.12m at47/54MAP independently checked. Pruning/training and fruit load influence height; context retained. |
| LAG-032 | Azadirachta indica | None | Government versusFAO5vs8year conflict reviewed. Contradictory generic envelopes stay separate, no cherry-picked date. |
| LAG-076 | Delonix regia | None | Researcher original seedling table reviewed; critic fresh primary fetch failed. Last-leaf insertion metric excluded from crown-top mapping. |
| LAG-053 | Casuarina equisetifolia | 02 | USDA original Table1 independently checked for each locality. Same-account plantation series qualify as conditional1-2year analogs at5m; not proof of repeated individuals or birth age. |
| LAG-054 | Ceiba pentandra | None | PROTA Ghana29cm6weeks and63cm51weeks after germination independently checked. Current stages all taller; no extrapolation. |
| LAG-135 | Milicia excelsa | None | Institutional examples reviewed as distinct sites and stock contexts. One-sided6m and32year18m observations are not one growth curve. |
| LAG-118 | Khaya senegalensis | None | Institutional Nigerian and Ivorian examples reviewed separately. Different sites/soils cannot form an age-size trajectory. |
| LAG-712 | Irvingia gabonensis | None | PROTA two12year site means independently checked. Distinct12m/8m examples retain ecological context; no pooled individual interval. |
| LAG-156 | Persea americana | None | Rootstock study located but age-height plot not digitized. Grafted stock clock is not seedling age; no numerical mapping. |
| LAG-169 | Psidium guajava | None | Publisher abstract335.7cm lacks explicit crop age. Study year is not age; null bounds retained. |
| LAG-142 | Moringa oleifera | None | Researcher six-month hedgerow1.76m extraction reviewed; critic PDF403. Ten-month branch length not promoted to height; context only. |
| LAG-208 | Theobroma cacao | None | PROSEA nursery40-50cm4-6months after sowing independently checked. Firstjorquette height uses another endpoint/clock and remains separate; current stages not matched. |
| LAG-027 | Artocarpus altilis | None | Institutional seed-to-fruit and pruning ages reviewed. Maintained height is not a dated mature-size trajectory; inaccessible Cuban study remains unverified. |

## Final acceptance scope

No material unclosed mapping or source-eligibility error remains in the current deliverable. The accepted product is a source-linked evidence register and conservative size-matched time annotations with explicit nulls. It is not100 calibrated species growth curves or300 biologically dated models. Raw field measurements from the actual stock, containers and growing conditions are still needed to establish those ages.

The accompanying [review.json](review.json) binds this decision to input hashes and provides the complete per-stage audit. [Evidence register](Age_Size_Evidence_100.json) and [300-stage annotations](Stage_Age_Assignments_300.json) retain all source clocks and alternatives.

## Geometry recheck, 2026-11-14

Independently joined all 300 annotations to the refreshed measurements by plant ID and stage and recomputed each conditional time interval from its source observations. The six revised Developed envelope stages have no comparable source interval at their measured heights. These are LAG-294 (2.1265 m), LAG-226 (2.6014 m), LAG-254 (2.1007 m), LAG-302 (1.9490 m), LAG-779 (3.2044 m), and LAG-289 (1.2888 m). The audit reproduced 24 alternatives across 21 stages, with 279 stages unassigned and 300 chronological ages unknown. The evidence records agree with the three reviewed batches. Updated measurements and file hashes are recorded in [review.json](review.json).

A second recheck on 2026-11-14 covered the seventh geometry correction. Bitterleaf (LAG-105) now measures 2.6216 m at its Developed envelope stage. Conflicting observation weeks and repeated cutting in the field study preclude a time assignment for this stage. Recalculation across all 300 stages reproduced 24 conditional alternatives across 21 stages, with 279 stages unassigned. [Updated audit and input hashes](review.json)

The final recheck on 2026-11-14 verified snake plant (LAG-630) at 0.3606 m for Establishment and 0.7754 m for Developed envelope, and Casuarina (LAG-053) at 21.9378 m for Developed envelope. The desert rose Developed envelope (LAG-410) measures 1.0617 m and its crown now spans 0.6415 × 0.6587 m. These four stages remain unassigned. Independent recalculation reproduced all 24 conditional alternatives across 21 of the 300 stages, with 279 stages unassigned. [Final audit and input hashes](review.json)

A final Casuarina density revision on 2026-11-14 increased the Developed envelope height by 0.2 mm to 21.9380 m and brought the crown spans to 9.9081 × 9.5638 m. The stage remains unassigned. Independent recalculation reproduced the same 24 conditional alternatives across 21 stages, with 279 stages unassigned. [Current measurements and input hashes](review.json)
