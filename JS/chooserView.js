var chooserView = Backbone.View.extend({

  el : "#modal1",

  initialize: function(){
    this.listenTo(this.model, "change", this.render);
    this.model.set("authenticated", false);
    this.model.set("myRoom", null);
    this.model.set("authenticated", false);
  },

  events: {
    "click .gameModes a" : "chooseMode"

  },

  render: function(){

  },

  delete : function(){
    this.$el.addClass('animated fadeOut');
    var model = this.model;
    setTimeout(function(){model.destroy()}, 150)
    
  },

  chooseMode: function(e){
    this.model.set("mode", $(e.currentTarget).data("mode"));
    if(this.model.get("mode")==="rank" || this.model.get("mode")==="norm"){
      this.chooseLane();
    } else {
    this.connect();
    } 
  },

  chooseLane: function(){
    var that = this;
    animate(this.$('.lanes'), "bounceIn", 0.5);
    this.$('.lanes a').on("click", function(e){
      that.model.set("lane", $(e.currentTarget).data('lane'));
      that.connect();
    });

  },

  connect: function(e){
    if($('#username').val().trim() == ''){
      animate($('#username'), 'swing shake wobble', 1);
      $('#error').html("<div class='alert'>You need a username!</div>");  
      animate($('#error'), 'bounceInDown');
      $('#username').focus();
    }else{
      if (this.model.get('authenticated') !== true){
        socket = io.connect(window.location.hostname, {
          reconnect:false
        });
        socketBindings();
        var userinfo = { lane: this.model.get("lane"),
                      username: $('#username').val().trim(),
                      mode: this.model.get("mode")
                       };
        socket.emit('laneSelected', userinfo);
        $('#modal1 .modal-body').html('Joining please wait...');
      }
    }
  }



});