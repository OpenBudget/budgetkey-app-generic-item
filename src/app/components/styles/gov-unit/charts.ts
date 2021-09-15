function getYfromX(items, x_field, y_field, x_values) {
  const lookup = {};
  for (const item of items) {
    lookup[item[x_field]] = item[y_field];
  }
  return x_values.map(x => lookup[x] || 0);
}

export const chartTemplates = [
    {
      location: 'services',
      id: 'services',
      query: `select :org-field as "משרד",
          count(1) as value
          from activities where :where group by 1 order by 1`,
      title: 'מספר השירותים החברתיים',
      titleTooltip: 'מספר השירותים ברכש החברתי הניתנים בשנה הנוכחית. לפירוט סוגי השירותים הנכללים באתר ראו דף "אודות". ישנם שירותים הכוללים מספר מכרזים. שינויים במספר השירותים יכול לנבוע משינויים במבנה ארגוני (כגון איחוד שירותים) או משינויים בדרכי ההפעלה של השירותים ואינם מעידים בהכרח על הפסקת אספקת השירותים',
      subtitle: 'סה״כ :total שירותים',
      x_field: 'משרד',
      y_field: 'value',
      layout: {
        barmode: 'stack',
        xaxis: {
          title: 'משרד / יחידה'
        },
        yaxis: {
          rangemode: 'tozero',
          title: 'מספר השירותים',
        }
      },
      kind: 'org',
      data: (items, info, xValues) => {
        return [{
          type: 'bar',
          name: 'default',
          x: xValues,
          y: getYfromX(items, info.x_field, info.y_field, xValues),
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
      title: 'מספר מפעילי השירותים',
      titleTooltip: 'מספר הגופים המפעילים את השירותים בשנה הנוכחית, בחלוקה למפעילים מהמגזר השלישי, המגזר העסקי ורשויות מקומיות. קטגוריית אחר כוללת למשל: הקדשים, שותפויות, תאגידים סטטוטורים, קופות חולים,  שירותי דת, אוניברסיטאות ועוד. ',
      x_field: 'משרד',
      y_field: 'value',
      subtitle: 'סה״כ :total מפעילים שונים ב:org',
      layout: {
        barmode: 'stack',
        xaxis: {
          title: 'משרד / יחידה'
        },
        yaxis: {
          title: 'מספר המפעילים'
        }
      },
      kind: 'org',
      data: (items, info, xValues) => {
        return ['עסקי', 'מגזר שלישי', 'רשויות מקומיות', 'אחר'].map((kind) => {
          return {
            type: 'bar',
            name: kind,
            x: xValues,
            y: getYfromX(items.filter((x) => x.kind === kind), info.x_field, info.y_field, xValues),
          }
        });
      }
    },
    {
      location: 'services',
      id: 'budget',
      query: `select :org-field as "משרד",
          sum(current_budget) as value
          from activities where :where group by 1 order by 1`,
      title: 'תקציב מאושר',
      titleTooltip: 'סך התקציב המאושר לשירותים בשנה הנוכחית. בחלק מהשירותים התקציב כולל השתתפות רשויות מקומיות',
      subtitle: 'סה״כ :total ₪',
      x_field: 'משרד',
      y_field: 'value',
      layout: {
        barmode: 'stack',
        xaxis: {
          title: 'משרד / יחידה'
        },
        yaxis: {
          title: 'תקציב מאושר',
          hoverformat: ',.0f'
        }
      },
      kind: 'org',
      data: (items, info, xValues) => {
        return [{
          type: 'bar',
          name: '',
          hovertemplate: '₪%{y}',
          x: xValues,
          y: getYfromX(items, info.x_field, info.y_field, xValues),
        }];
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
           sum((obj->>'approved')::numeric) as value,
           sum((obj->>'executed')::numeric) as value2
    FROM objs
    where (obj->>'year')::integer >= 2017
    GROUP BY 1,
             2
    order by 1, 2`,
      title: 'תקציב לאורך זמן',
      titleTooltip: 'סך התקציב המאושר לשירותים לפי שנים. התקציב מחושב באופן שנתי. שינויים בתקציב עשויים לנבוע ממעבר של שירותים לצורות הפעלה שונות (שאינן הליך מכרזי) ואינם מעידים בהכרח על הפסקת השירותים',
      x_field: 'year',
      y_field: 'value',
      y_field2: 'value2',
      subtitle: '(תקציב מאושר בקו רציף, הביצוע בקו מקווקו)',
      layout: {
        xaxis: {
          title: 'שנת תקציב'
        },
        yaxis: {
          title: '(₪) תקציב השירותים',
          hoverformat: ',.0f'
        }
      },
      kind: 'org',
      data: (items, info, xValues) => {
        const budgets = xValues.map((org) => {
          return {
            type: 'line',
            hovertemplate: '₪%{y}',
            name: org,
            x: items.filter((x) => x['משרד'] === org).map((x) => x[info.x_field]),
            y: items.filter((x) => x['משרד'] === org).map((x) => x[info.y_field]),
          }
        });
        if (xValues[0].indexOf('משרד ה') === 0) {
          budgets.push(...xValues.map((org) => {
            return {
              type: 'line',
              hovertemplate: '₪%{y}',
              line: {
                dash: 'dot',
              },
              name: org,
              x: items.filter((x) => x['משרד'] === org).map((x) => x[info.x_field]),
              y: items.filter((x) => x['משרד'] === org).map((x) => x[info.y_field2]),
            }
          }));
        }
        return budgets;
      }
    },
    // KEPT TO BE RE-ENABLED IN THE FUTURE
    // {
    //   location: 'services',
    //   id: 'service_trend',
    //   query: `WITH objs AS
    //   (SELECT :org-field as office,
    //           jsonb_array_elements("manualBudget"::JSONB) AS obj
    //    FROM all_activities
    //    WHERE :where and "manualBudget" IS NOT NULL
    //      AND "manualBudget" != 'null'),
    //      years AS
    //   (SELECT office,
    //           (obj->>'year')::integer AS year
    //    FROM objs)
    // SELECT office,
    //        year,
    //        count(1) AS value
    // FROM years
    // where year >= 2020
    // group by 1,2
    // ORDER BY 1`,
    //   title: 'מספר השירותים השונים לאורך זמן',
    //   subtitle: '',
    //   x_field: 'year',
    //   y_field: 'value',
    //   layout: {
    //     xaxis: {
    //       // tick0: 2019,
    //       title: 'שנה',
    //       dtick: 1,
    //       range: [2019.5, 2020.5]
    //     },
    //     yaxis: {
    //       title: 'מספר השירותים',
    //     }
    //   },
    //   kind: 'org',
    //   data: (items, info, xValues) => {
    //     return xValues.map((org) => {
    //       return {
    //         type: 'line',
    //         line: {
    //           dash: 'dot',
    //         },
    //         name: org,
    //         x: items.filter((x) => x.office === org).map((x) => x[info.x_field]),
    //         y: items.filter((x) => x.office === org).map((x) => x[info.y_field]),
    //       }
    //     });
    //   }
    // },
    // {
    //   location: 'services',
    //   id: 'supplier_trend',
    //   query: `WITH objs AS
    //   (SELECT :org-field as office,
    //           jsonb_array_elements(suppliers::JSONB) AS obj
    //    FROM activities
    //    WHERE :where and suppliers IS NOT NULL
    //      AND suppliers != 'null'),
    //      years AS
    //   (SELECT office,
    //           obj->>'entity_id' AS entity_id,
    //           jsonb_array_elements(obj->'activity_years') AS YEAR
    //    FROM objs)
    // SELECT office,
    //        (YEAR::text)::integer as year,
    //        count(DISTINCT entity_id) AS value
    // FROM years
    // where (YEAR::text)::integer >= 2020
    // group by 1,2
    // ORDER BY 1`,
    //   subtitleQuery: `WITH objs AS
    //   (SELECT :org-field as office,
    //           jsonb_array_elements(suppliers::JSONB) AS obj
    //    FROM activities
    //    WHERE :where and suppliers IS NOT NULL
    //      AND suppliers != 'null'),
    //      years AS
    //   (SELECT obj->>'entity_id' AS entity_id,
    //           jsonb_array_elements(obj->'activity_years') AS YEAR
    //    FROM objs)
    // SELECT max((YEAR::text)::integer) as max_year,
    //        min((YEAR::text)::integer) as min_year,
    //        count(DISTINCT entity_id) AS value
    // FROM years
    // where (YEAR::text)::integer >= 2020
    // ORDER BY 1`,
    //   title: 'מספר מפעילי השירותים לאורך זמן',
    //   titleTooltip: 'סך הגופים המפעילים את השירותים לאורך זמן (כל גוף מפעיל נספר פעם אחת, גם אם הוא מספק יותר משירות אחד)',
    //   x_field: 'year',
    //   y_field: 'value',
    //   subtitle: ':total מפעילים שונים ב:org', // בין השנים :min-year ל-:max-year',
    //   layout: {
    //     xaxis: {
    //       // tick0: 2019,
    //       title: 'שנה',
    //       dtick: 1,
    //       range: [2019.5, 2020.5]
    //     },
    //     yaxis: {
    //       title: 'מספר המפעילים',
    //     }
    //   },
    //   kind: 'org',
    //   data: (items, info, xValues) => {
    //     return xValues.map((org) => {
    //       return {
    //         type: 'line',
    //         line: {
    //           dash: 'dot',
    //         },
    //         name: org,
    //         x: items.filter((x) => x.office === org).map((x) => x[info.x_field]),
    //         y: items.filter((x) => x.office === org).map((x) => x[info.y_field]),
    //       }
    //     });
    //   }
    // },
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
      title: 'מספר שירותים לפי סוג מפעיל',
      titleTooltip: 'מספר השירותים הניתנים באופן בלעדי על ידי מפעילים ממגזר מסוים (עסקי, שלישי, אחר) ושירותים הניתנים על ידי שילוב בין מפעילים ממגזרים שונים ("משולב")',
      x_field: 'office',
      y_field: 'value',
      subtitle: 'סה״כ :total שירותים', // WAS: 'מספר השרותים שניתנים ע״י מפעילים מהמגזרים השונים',
      layout: {
        barmode: 'stack',
        xaxis: {
          title: 'משרד / יחידה'
        },
        yaxis: {
          title: 'מספר שירותים',
        }
      },
      kind: 'org',
      data: (items, info, xValues) => {
        const kinds = items.map((x) => x.supplier_kinds).filter((item, i, ar) => ar.indexOf(item) === i).sort();
        return kinds.map((kind) => {
          return {
            type: 'bar',
            name: kind,
            x: xValues,
            y: getYfromX(items.filter((x) => x.supplier_kinds === kind), info.x_field, info.y_field, xValues),
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
      titleTooltip: 'תקציב השירותים הניתנים באופן בלעדי על ידי מפעילים ממגזר מסוים (עסקי, שלישי, אחר), ותקציב השירותים הניתנים על ידי שילוב בין מפעילים ממגזרים שונים ("משולב")',
      x_field: 'office',
      y_field: 'value',
      subtitle: 'סה״כ :total ₪', // WAS: 'תקציב השרותים שניתנים ע״י מפעילים מהמגזרים השונים',
      layout: {
        barmode: 'stack',
        xaxis: {
          title: 'משרד / יחידה'
        },
        yaxis: {
          title: '(₪) תקציב השירותים',
        }
      },
      kind: 'org',
      data: (items, info, xValues) => {
        const kinds = items.map((x) => x.supplier_kinds).filter((item, i, ar) => ar.indexOf(item) === i).sort();
        return kinds.map((kind) => {
          return {
            type: 'bar',
            name: kind,
            x: xValues,
            y: getYfromX(items.filter((x) => x.supplier_kinds === kind), info.x_field, info.y_field, xValues),
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
           count(1) as value
    FROM activities
    where :where and supplier_count_category is not null
    group by 1,2
    ORDER BY 1`,
      title: 'מספר שירותים לפי היקף המפעילים',
      titleTooltip: 'מספר השירותים הניתנים על ידי מפעיל אחד, על ידי 5-2 גופים מפעילים ועל ידי 6 מפעילים ומעלה',
      x_field: 'office',
      y_field: 'value',
      subtitle: 'סה״כ :total שירותים', // WAS: 'מספר השרותים בחלוקה לכמות המפעילים בשירות',
      layout: {
        barmode: 'stack',
        xaxis: {
          title: 'משרד / יחידה'
        },
        yaxis: {
          title: 'מספר שירותים',
        }
      },
      kind: 'org',
      data: (items, info, xValues) => {
        const kinds = items.map((x) => x.supplier_count_category).filter((item, i, ar) => ar.indexOf(item) === i).sort();
        return kinds.map((kind) => {
          return {
            type: 'bar',
            name: kind,
            x: xValues,
            y: getYfromX(items.filter((x) => x.supplier_count_category === kind), info.x_field, info.y_field, xValues),
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
      titleTooltip: 'תקציב השירותים הניתנים על ידי מפעיל אחד, על ידי 5-2 מפעילים ועל ידי 6 מפעילים ומעלה',
      x_field: 'office',
      y_field: 'value',
      subtitle: 'סה״כ :total ₪', // WAS: 'תקציב השרותים בחלוקה לכמות המפעילים בשירות',
      layout: {
        barmode: 'stack',
        xaxis: {
          title: 'משרד / יחידה'
        },
        yaxis: {
          title: '(₪) תקציב השירותים',
        }
      },
      kind: 'org',
      data: (items, info, xValues) => {
        const kinds = items.map((x) => x.supplier_count_category).filter((item, i, ar) => ar.indexOf(item) === i).sort();
        return kinds.map((kind) => {
          return {
            type: 'bar',
            name: kind,
            x: xValues,
            y: getYfromX(items.filter((x) => x.supplier_count_category === kind), info.x_field, info.y_field, xValues),
          }
        });
      }
    },
    {
      location: 'suppliers',
      id: 'concentration',
      query: `
    SELECT :org-field as office,
           name,
           current_budget,
           jsonb_array_length(suppliers) as num_suppliers
    FROM activities
    where :where AND suppliers IS NOT NULL AND suppliers != 'null'
    `,
      title: 'מטריצת ריכוזיות',
      titleTooltip: 'מספר הגופים אשר מפעילים את השירות ביחס להיקף התקציב של השירות. ככל שתקציב השירות גדול יותר ומספר המפעילים קטן יותר, כך הריכוזוית גבוהה יותר.',
      x_field: 'current_budget',
      y_field: 'num_suppliers',
      text_field: 'name',
      subtitle: 'מספר המפעילים של השירות יחסית לתקציב השירות',
      layout: {
        xaxis: {
          type: 'log',
          autorange: true,
          title: '(₪) תקציב השירות',
        },
        yaxis: {
          type: 'log',
          autorange: true,
          title: 'מספר המפעילים',
        },
        hovermode:'closest'
      },
      kind: 'org',
      data: (items, info, xValues) => {
        return xValues.map((org) => {
          return {
            type: 'scatter',
            mode: 'markers',
            name: org,
            x: items.filter((x) => x.office === org).map((x) => x[info.x_field]),
            y: items.filter((x) => x.office === org).map((x) => x[info.y_field]),
            text: items.filter((x) => x.office === org).map((x) => x[info.text_field]),
          }
        });
      }
    },
  ];