function selectPaginated(query, start, end, orderBy, orderAs) {
  return `
    SELECT *
    FROM (

      SELECT ROW_NUMBER() OVER (ORDER BY (${orderBy}) ${orderAs}) AS [row_num]
    		,[add_row_num].*
    	FROM (

    		${query}

    	) AS [add_row_num]

    ) AS [results]
    WHERE [results].[row_num] BETWEEN ${start} AND ${end}
  `;
}

function selectRowCount(query) {
  return `
  SELECT COUNT(*) AS [count]
  FROM (${query}) AS [results]
  `;
}

module.exports = {
  selectPaginated,
  selectRowCount
}
