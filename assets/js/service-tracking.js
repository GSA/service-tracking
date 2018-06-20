
var Tracker = {
  fetch: function() {
    var input = $("#hostname").val();
    var hostname = Tracker.hostnameFor(input);
    var url = Tracker.jsonFor(hostname);

    $.get(url, function(data) {
      var json = JSON.stringify(data, undefined, 2);
      $("#json code").text(json);

      hljs.highlightBlock($("#json code").get(0));
    });

    return false;
  },

  jsonFor: function(hostname) {
    var scanner = "pshtt";
    var bucket = "cg-4adefb86-dadb-4ecf-be3e-f1c7b4f6d084";
    var region = "us-gov-west-1";
    return "https://s3-" + region + ".amazonaws.com/" + bucket + "/live/subdomains/scan/cache/" + scanner + "/" + hostname + ".json";
  },

  // TODO: sanitize
  hostnameFor: function(input) {
    return input;
  }
};

$(function() {

$("#fetch").click(Tracker.fetch);


});
