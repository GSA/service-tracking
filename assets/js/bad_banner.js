
var Banner = {

  fetch: function() {

    $.get(Banner.dataURL(), function(data) {
      // TODO: load table

      var json = JSON.stringify(data, undefined, 2);
      $("#banner code").text(json);
      hljs.highlightBlock($("#banner code").get(0));
    });

    $.get(Utils.scanMetaURL(), function(data) {
      $(".end_time").text(data.durations.uswds.end_time);

      var json = JSON.stringify(data, undefined, 2);
      $("#meta code").text(json);
      hljs.highlightBlock($("#meta code").get(0));
    });
  },

  dataURL: function() {
    return Utils.s3Prefix() + "live/processed/bad_banner.json";
  }

};


$(function() {
  Banner.fetch();
});
