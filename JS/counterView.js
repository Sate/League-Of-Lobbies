var counterView = Backbone.View.extend({

  tagName: "div",

  initialize: function(){
    var that = this;
    this.listenTo(this.model, "change", this.render);
    setInterval(function(){that.model.fetch()}, 1000);
    this.dictionary = {
        jun: "Jungle",
        sup: "Support",
        adc: "AD Carry",
        mid: "Solo Mid",
        top: "Solo Top",
        aram: "ARAM"
      }
  },

  render: function(){
    this.$el.html("<div class='label label-info'>Current players in queue</div><br/>");
    for (var i in this.model.attributes){
      this.$el.append("<div class='label'>"+this.model.attributes[i]+' '+this.dictionary[i]+"</div>");
    }
  }

});





