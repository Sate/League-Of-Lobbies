var counterModel = Backbone.Model.extend({
  
  defaults: function(){
    return {jun: 0, top:0, mid:0, adc:0, sup:0}
  },

  urlRoot: '/stats',

  toggle: function(){
    this.set({"done": !this.get("done")})
  }

});