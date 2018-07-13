
var USWDS = {

  fetch: function() {

    $.get(USWDS.dataURL(), function(data) {
      renderTable(data);
    });

    $.get(Utils.scanMetaURL(), function(data) {
      $(".end_time").text(data.durations.uswds.end_time);

      var json = JSON.stringify(data, undefined, 2);
      $("#meta code").text(json);
      hljs.highlightBlock($("#meta code").get(0));
    });
  },

  dataURL: function() {
    return Utils.s3Prefix() + "live/processed/uswds_present.json";
  },

  // takes an array of flat JSON objects, converts them to arrays
  // renders them into a small table as an example
  renderTable: function(rows) {

    var header = ["Detected"];

    // find CSV table
    var table = $(".csv table")[0];
    $(table).text("");

    // render header row
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    for (field in header) {
      var th = document.createElement("th");
      $(th).text(header[field])
      tr.appendChild(th);
    }
    thead.appendChild(tr);

    // render body of table
    var tbody = document.createElement("tbody");
    for (var i=1; i<rows.length; i++) {
      var hostname = rows[i].hostname;
      var link = rows[i].scanned_url;

      tr = document.createElement("tr");
      var td = document.createElement("td");
      $(td)
        .html("<a href=\"" + link + "\">" + hostname + "</a>")
        .attr("title", hostname);
      tr.appendChild(td);
      tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
  }

};


$(function() {
  USWDS.fetch();
});
