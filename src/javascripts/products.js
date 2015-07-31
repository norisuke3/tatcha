$(document).ready(function(){
  var amount = 10;
  var page = 1;
  var total_amount = 104;
  var urls = {};              // url cache

  var get_last_page = function(){
    return Math.ceil( total_amount / amount );
  };

  /** ------------------
   *   Product
   *     - models
   */
  var Product = Backbone.Model.extend({
    idAttribute: "entity_id",
    initialize: function(){
      var url = urls[this.attributes.entity_id];
      url && this.set({ url: url });
      url || this.fetch({ success: this.on_success });
    },
    on_success: function(model, response, options){
      urls[model.get('entity_id')] = model.get('url');
    }
  });

  var ProductList = Backbone.Collection.extend({
    model: Product,
    url: "http://api.tatcha.com/shop/api/rest/products",
    parse: function(response){
      return _(response).values();
    }
  });

  /** ------------------
   *   Product
   *     - views
   */
  var ProductView = Backbone.View.extend({
    template: _.template($("#template-product").html()),
    events:{
      "click": "link"
    },
    render: function(){
      this.setElement(this.template(this.model.toJSON()));
      return this;
    },
    link: function(){
      this.model.get('url') && ( location.href = this.model.get('url') );
    }
  });

  var ProductListView = Backbone.View.extend({
    className: "product-list",
    initialize: function(options){
      _.bindAll(this, "addOne");
      this.options = this.options || {};
      this.options.views = options.views;
    },
    addOne: function(model){
      this.options.views[model.cid] = new ProductView({ model: model });
      this.$el.append(this.options.views[model.cid].render().el);
    },
    render: function(){
      this.collection.each(this.addOne);
      return this;
    }
  });

  var ProductComponent = Backbone.View.extend({
    template: _.template($("#template-pagination").html()),
    el: ".contents",
    events: {
      "change select.amount": "set_amount",
      "click .pagination li": "set_page"
    },
    initialize: function(){
      this.collection.on("reset", this.update_list, this);
      this.views = {};

      this.update_pagination();
      $('li.page1').addClass("active");
    },
    update_list: function(collection){
      this.list = new ProductListView({ collection: collection, views: this.views });
      this.$(".product-list").replaceWith(this.list.render().el);

      // initialize Masonry jQuery plugin
      this.$('.product-list').masonry({
        itemSelector: '.product'
      });
    },
    set_amount: function(e){
      amount = e.currentTarget.value;
      this.update_pagination();
      this.refresh();
    },
    set_page: function(e){
      page = e.currentTarget.textContent.trim();
      this.refresh();
    },
    refresh: function(){
      $("li.page").removeClass("active");
      $("li.page"+page).addClass("active");
      products.fetch({ reset: true, data: { limit: amount, page: page }});
    },
    update_pagination: function(){
      page = 1;
      $("li.page").remove();
      for(var i = 1; i <= get_last_page() ; i++){
        this.$('ul.pagination').append(this.template({ page: i }));
      }
    }
  });

  /** --------------------------
   *   Backbone initialization
   *  -------------------------- */
  var products         = new ProductList();
  var productComponent = new ProductComponent({ collection: products });

  products.fetch({ reset: true });
});
