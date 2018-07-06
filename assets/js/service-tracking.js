
var Tracker = {
  fetch: function() {
    var input = $("#hostname").val();
    var hostname = Tracker.hostnameFor(input);
    var url = Tracker.scanURL("third_parties", hostname);

    // TODO: spinner
    $("#json code").text('');
    $("#error").hide();

    $.get(url, function(data) {
      var json = JSON.stringify(data, undefined, 2);
      $("#json code").text(json);

      hljs.highlightBlock($("#json code").get(0));
    })
    .fail(function() {
      $("#error")
        .text("Couldn't find any scan results for " + hostname + ".")
        .show();
    });

    return false;
  },

  scanURL: function(scanner, hostname) {
    return Utils.s3Prefix() + "live/scan/cache/"
      + scanner + "/" + hostname + ".json";
  },

  hostnameFor: function(input) {
    var hostname = input;
    hostname = hostname.replace(/^https?:\/\//, ''); // drop protocol
    hostname = hostname.replace(/^www\./, ''); // drop www prefix
    hostname = hostname.replace(/\/.*$/, ''); // query string and hash
    return hostname;
  }
};

$(function() {
  $("#fetch").click(Tracker.fetch);
});
