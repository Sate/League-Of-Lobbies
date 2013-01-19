var AppView = Backbone.View.extend({

  el : ".container.main",

  initialize: function(){
    this.setUpChoice();
    chooser = new chooserView({model: new Backbone.Model});
    counter = new counterModel();
    counterV = new counterView({model:counter});
    counterV.$el.appendTo($('.modal-header'));
    // this.listenTo(this.model, "change", this.render);
    // this.model.on('destroy', this.remove, this);
    // this.$el.addClass("hide active todo");
    // this.render().appendTo('body');
    // this.$input = this.$("input[type='text']");
  },

  events: {
    

  },


  render: function(){ 
    this.$('span').text(this.model.get("text"));
    // console.log(this);
    this.$el.removeClass('hide');
    return this.$el; 
  },

  toggleDone: function(){
    console.log(this.model);
    this.model.toggle();
    this.$el.toggleClass("done alert alert-success", this.model.get("done"));
    this.$el.toggleClass("active  ", !this.model.get("done"));
  },

  edit: function(){
    this.$('span').addClass('hide');
    this.$('input[type=\'text\']').val(this.model.get("text"));
    this.$('input').removeClass('hide').focus();
  },

  inputhack: function() {
    this.submitEnter( {'which': 13} );
  },

  submitEnter : function(e){
    if (e.which === 13 ) {
      this.model.set({"text" : this.$input.val() });
      this.$input.addClass('hide');
      this.$('span').removeClass('hide');
      }
  },

  setUpChoice: function(){
    setTimeout(function(){
    $('#modal1').modal('show');
    }, 400);
    setTimeout(function(){
    animate($('html'), 'fadeIn', 0.8);
    $('#username').focus();
    },850); 
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
        console.log($(e.currentTarget).data('lane'));
        var userinfo = {lane: $(e.currentTarget).data('lane'),
                      username: $('#username').val().trim() };
        socket.emit('laneSelected', userinfo);
        $('#modal1 .modal-body').html('Joining please wait...');
      }
    }
  },

  delete : function(){
    this.$el.addClass('animated bounceOutLeft');
    var model = this.model;
    setTimeout(function(){model.destroy()}, 150)
    
  }

});