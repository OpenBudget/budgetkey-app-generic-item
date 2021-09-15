import { format_ils } from '../../../pipes';

function processOrgUnit(row) {
  const orgUnit = row.org_unit;
  const parts = orgUnit.split(' / ');
  parts[0] = `<a target='_blank' href='/i/units/gov_social_service_unit/${parts[0]}?theme=soproc'>${parts[0]}</a>`;
  return parts.join(' / ');
}

export const tableDefs = {
  tenders: {
    name: 'הליכי רכש',
    query: `
    with t as (
      select office || ' / ' || unit || ' / ' || subunit as org_unit,
              jsonb_array_elements(tenders) as tenders
              from activities where :where and tenders is not null and tenders::text != 'null'
    ) select tenders->>'tender_type_he' as tender_type_he,
              tenders->>'tender_id' as tender_id,
              tenders->>'sub_kind_he' as sub_kind_he,
              tenders->>'publication_id' as publication_id,
              tenders->>'tender_key' as tender_key,
              tenders->>'description' as description,
              tenders->>'page_url' as page_url,
              org_unit,
              tenders->>'end_date' as end_date,
              tenders->>'end_date_extended' as end_date_extended
              from t
    `,
    downloadHeaders: [
      'מכרז / פטור<tender_type_he',
      'סוג הליך רכש<sub_kind_he',
      'שם מכרז<description',
      'יחידה ארגונית<org_unit',
      'תוקף מכרז/פטור<end_date',
      'תוקף מכרז כולל אופציות<end_date_extended'
    ],
    fields: [
      'tender_type_he', 'sub_kind_he', 'description', 'org_unit', 'end_date', 'end_date_extended'
    ],
    uiHeaders: [
      'מכרז / פטור',
      'סוג הליך רכש',
      'שם מכרז',
      'מספר הליך מכרזי',
      'יחידה ארגונית',
      `<span class='bk-tooltip-anchor'>תוקף מכרז/פטור<span class='bk-tooltip'>תוקף ההליך המכרזי אשר באמצעותו ניתן השירות</span></span>`,
      `<span class='bk-tooltip-anchor'>תוקף מכרז כולל אופציות<span class='bk-tooltip'>תוקף ההליך המכרזי כולל כל האופציות שניתנו במסגרתו (מוערך- המשרד לא בהכרח יממש את האופציות שניתנו)</span></span>`,
    ],
    uiHtml: [
      (row) => row.tender_type_he,
      (row) => row.sub_kind_he,
      (row) => `<a href='${row.page_url}' target='_blank'>${row.description}</a>`,
      (row) => (row.tender_id === 'none' ? null : row.tender_id) || row.publication_id || row.tender_key.split(':')[0],
      processOrgUnit,
      (row) => row.end_date || '',
      (row) => row.end_date_extended || '',
    ],
    sorting: [
      'tender_type_he', 'sub_kind_he', 'description', `coalesce(tenders->>'tender_id', tenders->>'tender_key')`, 'org_unit', 'end_date', 'end_date_extended'
    ]
  },
  suppliers: {
    name: 'מפעילים',
    query: `WITH s AS
      (SELECT jsonb_array_elements(suppliers) AS supplier
        FROM activities
        WHERE :where AND suppliers IS NOT NULL
          AND suppliers::text != 'null' ),
          e AS
      (SELECT supplier->>'entity_id' AS id,
              supplier->>'entity_name' AS name,
              supplier->>'entity_kind' as entity_kind,
              case supplier->>'entity_kind'
                  when 'company' then 'עסקי'
                  when 'municipality' then 'רשויות מקומיות'
                  when 'association' then 'מגזר שלישי'
                  when 'ottoman-association' then 'מגזר שלישי'
                  when 'cooperative' then 'מגזר שלישי'
                  else 'אחר (' || (supplier->>'entity_kind_he') || ')'
              end as kind,
              supplier->'geo' AS region,
              guidestar.association_yearly_turnover as association_yearly_turnover
        FROM s
        LEFT JOIN guidestar on (supplier->>'entity_id' = guidestar.id)
        )
    SELECT :fields
    FROM e`,
    downloadHeaders: [
        `מספר תאגיד<id`,
        `שם המפעיל<name`,
        `מגזר המפעיל<kind`,
        `איזורים גיאוגרפיים בהם פועל:comma-separated<region`,
        `מחזור שנתי (לעמותות)<association_yearly_turnover`
    ],
    fields: [
        'id', 'name', 'kind', 'region', 'entity_kind', 'association_yearly_turnover'
    ],
    uiHeaders: [
        `מספר תאגיד`,
        `שם המפעיל`,
        `מגזר המפעיל`,
        `<span class='bk-tooltip-anchor'>איזורים גיאוגרפיים בהם פועל<span class='bk-tooltip'>האם המפעיל מספק את השירות באופן ארצי או שזכה בהפעלת השירות באיזור גיאוגרפי מסוים</span></span>`,
        `<span class='bk-tooltip-anchor'>מחזור שנתי (לעמותות)<span class='bk-tooltip'>המחזור הכספי השנתי הכולל של העמותה (לא רק רכש חברתי)</span></span>`,
    ],
    uiHtml: [
        (row) => row.id,
        (row) =>  row.id  ? `<a target='_blank' href='/i/org/${row.entity_kind}/${row.id}?theme=soproc'>${row.name}</a>` : row.name,
        (row) => row.kind,
        (row) => row.region.join(', '),
        (row) => format_ils(row.association_yearly_turnover),
    ],
    sorting: [
        'id', 'name', 'kind', 'region', 'association_yearly_turnover'
    ],
  },
};