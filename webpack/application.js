import $ from "jquery";

import AppCanvas from "./components/app_canvas";
import ExploreHero from "./components/explore_hero";
import BlockSandboxForm from "./components/block_sandbox_form";
import Schema from "./components/schema";
import JSONTree from "react-json-tree";

import { mountComponents } from "react-rails-ujs";

mountComponents({
  AppCanvas,
  BlockSandboxForm,
  ExploreHero,
  JSONTree,
  Schema,
});

$(document).ajaxSend(function(e, xhr, options) {
  var token = $("meta[name='csrf-token']").attr("content");
  xhr.setRequestHeader("X-CSRF-Token", token);
});

$(document).ready(function() {
  const env = $("body")[0].dataset.railsEnv;

  if(env === "test") {
    $.fx.off = true;
    $.ajaxSetup({ async: false });
  }
});