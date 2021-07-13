export const chartTemplates = [
    {
      location: 'services',
      id: 'services',
      query: `select :org-field as "משרד",
          count(1) as value
          from activities where :where group by 1 order by 1`,
      title: 'שירותים',
      subtitle: 'סה״כ :total שירותים',
      x_field: 'משרד',
      y_field: 'value',
      layout: {barmode: 'stack'},
      data: (items, info) => {
        return [{
          type: 'bar',
          name: info.title,
          x: items.map((x) => x[info.x_field]),
          y: items.map((x) => x[info.y_field]),
        }];
      }
    },
    {
      location: 'services',
      id: 'budget',
      query: `select :org-field as "משרד",
          sum(current_budget) as value
          from activities where :where group by 1 order by 1`,
      title: 'תקציב מאושר',
      subtitle: 'סה״כ :total ₪',
      x_field: 'משרד',
      y_field: 'value',
      layout: {barmode: 'stack'},
      data: (items, info) => {
        return [{
          type: 'bar',
          name: info.title,
          x: items.map((x) => x[info.x_field]),
          y: items.map((x) => x[info.y_field]),
        }];
      }
    },
    {
      location: 'services',
      id: 'supplier_kinds',
      query: `WITH objs AS
      (SELECT :org-field as office,
              jsonb_array_elements(suppliers::JSONB) AS obj
       FROM activities
       WHERE :where AND suppliers IS NOT NULL 
         AND suppliers != 'null' )
    SELECT office as "משרד",
           case obj->>'entity_kind'
           when 'company' then 'עסקי'
           when 'municipality' then 'רשויות מקומיות'
           when 'association' then 'מגזר שלישי'
           when 'ottoman-association' then 'מגזר שלישי'
           when 'cooperative' then 'מגזר שלישי'
           else 'אחר'
           end as kind,
          count(DISTINCT (obj->>'entity_id')) as value
    FROM objs
    WHERE obj->'year_activity_end' is null
    GROUP BY 1,
             2
    order by 1`,
      subtitleQuery: `WITH objs AS
      (SELECT :org-field as office,
              jsonb_array_elements(suppliers::JSONB) AS obj
       FROM activities
       WHERE :where AND suppliers IS NOT NULL 
         AND suppliers != 'null' )
    SELECT count(DISTINCT (obj->>'entity_id')) as value
    FROM objs
    WHERE obj->'year_activity_end' is null
    `,
      title: 'מפעילים',
      x_field: 'משרד',
      y_field: 'value',
      subtitle: 'סה״כ :total מפעילים פעילים שונים ב:org',
      layout: {
        barmode: 'stack',
      },
      data: (items, info) => {
        return ['עסקי', 'מגזר שלישי', 'רשויות מקומיות', 'אחר'].map((kind) => {
          return {
            type: 'bar',
            name: kind,
            x: items.filter((x) => x.kind === kind).map((x) => x[info.x_field]),
            y: items.filter((x) => x.kind === kind).map((x) => x[info.y_field]),
          }
        });
      }
    },
    {
      location: 'services',
      id: 'budget_trend',
      query: `WITH objs AS
      (SELECT :org-field as office,
              jsonb_array_elements("manualBudget"::JSONB) AS obj
       FROM activities
       WHERE :where AND "manualBudget" IS NOT NULL
         AND "manualBudget" != 'null' )
    SELECT office as "משרד",
           (obj->>'year')::integer as year,
           sum((obj->>'approved')::numeric) as value
    FROM objs
    GROUP BY 1,
             2
    order by 1, 2`,
      title: 'תקציב לאורך זמן',
      x_field: 'year',
      y_field: 'value',
      subtitle: 'סה״כ :total ₪',
      layout: {
      },
      data: (items, info) => {
        const orgs = items.map((x) => x['משרד']).filter((item, i, ar) => ar.indexOf(item) === i).sort();
        return orgs.map((org) => {
          return {
            type: 'line',
            name: org,
            x: items.filter((x) => x['משרד'] === org).map((x) => x[info.x_field]),
            y: items.filter((x) => x['משרד'] === org).map((x) => x[info.y_field]),
          }
        });
      }
    },
    {
      location: 'services',
      id: 'supplier_trend',
      query: `WITH objs AS
      (SELECT :org-field as office,
              jsonb_array_elements(suppliers::JSONB) AS obj
       FROM activities
       WHERE :where and suppliers IS NOT NULL
         AND suppliers != 'null'),
         years AS
      (SELECT office,
              obj->>'entity_id' AS entity_id,
              jsonb_array_elements(obj->'activity_years') AS YEAR
       FROM objs)
    SELECT office,
           (YEAR::text)::integer as year,
           count(DISTINCT entity_id) AS value
    FROM years
    where (YEAR::text)::integer >= 2020
    group by 1,2
    ORDER BY 1`,
      subtitleQuery: `WITH objs AS
      (SELECT :org-field as office,
              jsonb_array_elements(suppliers::JSONB) AS obj
       FROM activities
       WHERE :where and suppliers IS NOT NULL
         AND suppliers != 'null'),
         years AS
      (SELECT obj->>'entity_id' AS entity_id,
              jsonb_array_elements(obj->'activity_years') AS YEAR
       FROM objs)
    SELECT max((YEAR::text)::integer) as max_year,
           min((YEAR::text)::integer) as min_year,
           count(DISTINCT entity_id) AS value
    FROM years
    where (YEAR::text)::integer >= 2020
    ORDER BY 1`,
      title: 'מפעילים לאורך זמן',
      x_field: 'year',
      y_field: 'value',
      subtitle: ':total מפעילים שונים ב:org', // בין השנים :min-year ל-:max-year',
      layout: {
      },
      data: (items, info) => {
        const orgs = items.map((x) => x.office).filter((item, i, ar) => ar.indexOf(item) === i).sort();
        return orgs.map((org) => {
          return {
            type: 'line',
            name: org,
            x: items.filter((x) => x.office === org).map((x) => x[info.x_field]),
            y: items.filter((x) => x.office === org).map((x) => x[info.y_field]),
          }
        });
      }
    },
    {
      location: 'suppliers',
      id: 'supplier_kinds_budget',
      query: `
    SELECT :org-field as office,
           supplier_kinds,
           sum(current_budget) as value
    FROM activities
    where :where and supplier_kinds is not null
    group by 1,2
    ORDER BY 1`,
      title: 'תקציב שירותים לפי סוג מפעיל',
      x_field: 'office',
      y_field: 'value',
      subtitle: 'סה״כ :total ₪', // WAS: 'תקציב השרותים שניתנים ע״י מפעילים מהמגזרים השונים',
      layout: {barmode: 'stack'},
      data: (items, info) => {
        const kinds = items.map((x) => x.supplier_kinds).filter((item, i, ar) => ar.indexOf(item) === i).sort();
        return kinds.map((kind) => {
          return {
            type: 'bar',
            name: kind,
            x: items.filter((x) => x.supplier_kinds === kind).map((x) => x[info.x_field]),
            y: items.filter((x) => x.supplier_kinds === kind).map((x) => x[info.y_field]),
          }
        });
      }
    },
    {
      location: 'suppliers',
      id: 'supplier_kinds_count',
      query: `
    SELECT :org-field as office,
           supplier_kinds,
           count(1) as value
    FROM activities
    where :where and supplier_kinds is not null
    group by 1,2
    ORDER BY 1`,
      title: 'מס׳ שירותים לפי סוג מפעיל',
      x_field: 'office',
      y_field: 'value',
      subtitle: 'סה״כ :total שירותים', // WAS: 'מספר השרותים שניתנים ע״י מפעילים מהמגזרים השונים',
      layout: {barmode: 'stack'},
      data: (items, info) => {
        const kinds = items.map((x) => x.supplier_kinds).filter((item, i, ar) => ar.indexOf(item) === i).sort();
        return kinds.map((kind) => {
          return {
            type: 'bar',
            name: kind,
            x: items.filter((x) => x.supplier_kinds === kind).map((x) => x[info.x_field]),
            y: items.filter((x) => x.supplier_kinds === kind).map((x) => x[info.y_field]),
          }
        });
      }
    },
    {
      location: 'suppliers',
      id: 'supplier_count_category_budget',
      query: `
    SELECT :org-field as office,
           supplier_count_category,
           sum(current_budget) as value
    FROM activities
    where :where and supplier_count_category is not null
    group by 1,2
    ORDER BY 1`,
      title: 'תקציב שירותים לפי היקף המפעילים',
      x_field: 'office',
      y_field: 'value',
      subtitle: 'סה״כ :total ₪', // WAS: 'תקציב השרותים בחלוקה לכמות המפעילים בשירות',
      layout: {barmode: 'stack'},
      data: (items, info) => {
        const kinds = items.map((x) => x.supplier_count_category).filter((item, i, ar) => ar.indexOf(item) === i).sort();
        return kinds.map((kind) => {
          return {
            type: 'bar',
            name: kind,
            x: items.filter((x) => x.supplier_count_category === kind).map((x) => x[info.x_field]),
            y: items.filter((x) => x.supplier_count_category === kind).map((x) => x[info.y_field]),
          }
        });
      }
    },
    {
      location: 'suppliers',
      id: 'supplier_count_category_count',
      query: `
    SELECT :org-field as office,
           supplier_count_category,
           sum(current_budget) as value
    FROM activities
    where :where and supplier_count_category is not null
    group by 1,2
    ORDER BY 1`,
      title: 'מס׳ שירותים לפי היקף המפעילים',
      x_field: 'office',
      y_field: 'value',
      subtitle: 'סה״כ :total שירותים', // WAS: 'מספר השרותים בחלוקה לכמות המפעילים בשירות',
      layout: {barmode: 'stack'},
      data: (items, info) => {
        const kinds = items.map((x) => x.supplier_count_category).filter((item, i, ar) => ar.indexOf(item) === i).sort();
        return kinds.map((kind) => {
          return {
            type: 'bar',
            name: kind,
            x: items.filter((x) => x.supplier_count_category === kind).map((x) => x[info.x_field]),
            y: items.filter((x) => x.supplier_count_category === kind).map((x) => x[info.y_field]),
          }
        });
      }
    },
    {
      location: 'suppliers',
      id: 'concentration',
      query: `
    SELECT :org-field as office,
           current_budget,
           jsonb_array_length(suppliers) as num_suppliers
    FROM activities
    where :where and supplier_count_category is not null`,
      title: 'מטריצת ריכוזיות',
      x_field: 'current_budget',
      y_field: 'num_suppliers',
      subtitle: 'כמות המפעילים של השירות יחסית לתקציב השירות',
      layout: {
        xaxis: {
          type: 'log',
          autorange: true
        },
        yaxis: {
          type: 'log',
          autorange: true
        }
      },
      data: (items, info) => {
        const orgs = items.map((x) => x.office).filter((item, i, ar) => ar.indexOf(item) === i).sort();
        return orgs.map((org) => {
          return {
            type: 'scatter',
            mode: 'markers',
            name: org,
            x: items.filter((x) => x.office === org).map((x) => x[info.x_field]),
            y: items.filter((x) => x.office === org).map((x) => x[info.y_field]),
          }
        });
      }
    },
  ];