var Utils = {

  s3Prefix: function() {
    // could vary in future, this is env-specific
    var bucket = "tts-public-data";
    var prefix = "service-tracking"
    var region = "us-east-1";

    var fullRegion;
    if (region == "us-east-1")
      fullRegion = "s3";
    else
      fullRegion = "s3-" + region;

    return "https://" + fullRegion + ".amazonaws.com/"
      + bucket + "/" + prefix + "/";
  },

  scanMetaURL: function() {
    return Utils.s3Prefix() + "live/scan/results/meta.json";
  }

};