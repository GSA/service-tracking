
var Tracker = {
  fetch: function() {
    var input = $("#hostname").val();
    var hostname = Tracker.hostnameFor(input);
    var url = Tracker.jsonFor(hostname);

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

  jsonFor: function(hostname) {
    var scanner = "third_parties";
    var bucket = "tts-public-data";
    var prefix = "service-tracking"
    var region = "us-east-1";

    var fullRegion;
    if (region == "us-east-1")
      fullRegion = "s3";
    else
      fullRegion = "s3-" + region;

    return "https://" + fullRegion + ".amazonaws.com/"
      + bucket + "/" + prefix + "/live/scan/cache/"
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
