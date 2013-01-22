var AppView = Backbone.View.extend({

  el : ".container.main",

  initialize: function(){
    chooser = new chooserView({model: new Backbone.Model});
    counterV = new counterView({model: new counterModel()});
    counterV.$el.appendTo($('.modal-header'));
    roomList = new roomListView({collection: new roomListCollection()});
  },

  events: {
    "keydown input.chatinput" : "sendMessage",
    "click #fontToggle" : "toggleFont",
    "click #requeue" : 'requeue'
  },

  toggleFont: function(e){
    e.preventDefault();
    this.$('.chatinput').toggleClass('brush');
    this.$('.chatText').toggleClass('brush');
  },

  requeue: function(e){
    e.preventDefault();
    socket.emit('requeue');
  },  

  handleMessage: function(data){
    var laneDict = counterV.dictionary;
    if (data.player.lane){
    data.player.lane = laneDict[data.player.lane];
    }
    var username = data.player.username;
    var userlane = data.player.lane;
    var message = data.message;
    this.$('.chatText').append('<b>'+username+' ('+userlane+')</b>: '+message+'<br/>');
    this.$('.chatText').scrollTop(this.$('.chatText')[0].scrollHeight);
  },

  sendMessage: function(e){
    var input = $(e.currentTarget).val().trim();
    if (e.which!==13 || input == "") return;
    socket.emit('messageSent', { input: input, room: chooser.model.get("myRoom") } );
    $(e.currentTarget).val('');  
  },


  render: function(){ 
  },

  submitEnter : function(e){
    if (e.which === 13 ) {
      this.model.set({"text" : this.$input.val()});
      this.$input.addClass('hide');
      this.$('span').removeClass('hide');
      }
  },

  connect: function(e){
    e.preventDefault();
    if($('#username').val().trim() == ''){
      animate($('#username'), 'swing shake wobble', 1);
      $('#error').html("<div class='alert'>You need a username!</div>");  
      animate($('#error'), 'bounceInDown');
      $('#username').focus();
    }else{
      if (this.authenticated !== true){
        socket = io.connect(window.location.hostname, {
          reconnect:false
        });
        socketBindings();
        var userinfo = {lane: $(e.currentTarget).data('lane'),
                      username: $('#username').val().trim() };
        socket.emit('laneSelected', userinfo);
        chooser.$('.modal-body').html('Joining please wait...');
      }
    }
  },

  delete : function(){
    this.$el.addClass('animated bounceOutLeft');
    var model = this.model;
    setTimeout(function(){model.destroy()}, 150)
    
  },

  showChat: function(){
    counterV.$el.appendTo($('h1'));
    animate(counterV.$el, 'bounceInLeft', 0.7);
    animate(this.$('#chatbox'), 'bounceInRight', 0.7);
    setTimeout(function(){
    this.$('input.chatinput').focus();
    animate(roomList.$el, 'fadeIn');
    }, 600)

      
  }

});