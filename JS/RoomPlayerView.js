var RoomPLayerView = Backbone.View.extend({

  tagName : "div",

  initialize: function(){
    // this.$el.addClass("hide active todo");
    this.listenTo(this.model, "change", this.render);
    this.model.on('destroy', this.remove, this);
    this.$el.addClass('animated fadeIn');
    var thisel = this.$el;
    setTimeout(function(){thisel.destroy()}, 150)
  },

  events: {
  },

  delete : function(){
    this.$el.addClass('animated fadeOut');
    var model = this.model;
    setTimeout(function(){model.destroy()}, 150)
    
  }

});