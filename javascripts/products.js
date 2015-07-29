$(document).ready(function(){
  /** ------------------
   *   Product
   *     - models
   */
  var Product = Backbone.Model.extend({
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
    events:{},
    render: function(){
      this.setElement(this.template(this.model.toJSON()));
      return this;
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
    el: ".contents",
    events: {},
    initialize: function(){
      this.collection.on("reset", this.update_list, this);
      this.views = {};
    },
    update_list: function(collection){
      this.list = new ProductListView({ collection: collection, views: this.views });
      this.$(".product-list").replaceWith(this.list.render().el);

      // initialize Masonry jQuery plugin
      this.$('.product-list').masonry({
	itemSelector: '.product'
      });
    }
  });

  /** --------------------------
   *   Backbone initialization
   *  -------------------------- */
  var products         = new ProductList();
  var productComponent = new ProductComponent({ collection: products });

  products.fetch({ reset: true });
});
