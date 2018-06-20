
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
    var location;
    if (hostname.split(".").length == 2)
      location = "parents";
    else
      location = "subdomains/scan";

    var scanner = "pshtt";
    var bucket = "cg-4adefb86-dadb-4ecf-be3e-f1c7b4f6d084";
    var region = "us-gov-west-1";

    return "https://s3-" + region + ".amazonaws.com/" + bucket + "/live/" + location + "/cache/" + scanner + "/" + hostname + ".json";
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
