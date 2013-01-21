var roomPlayerView = Backbone.View.extend({

  tagName : "div",

  initialize: function(){
    this.listenTo(this.model, "change", this.render);
    this.$el.addClass('animated fadeIn');
  },

  events: {
  },

  render : function(data){
  }

});

