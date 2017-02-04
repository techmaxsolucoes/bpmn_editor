frappe.provide('bpmn');
frappe.pages['bpmn-viewer'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'BPMN Viewer',
		single_column: true
	});

	function init(){
		bpmn.viewer = new bpmn.Viewer(wrapper, page);
	}

	// hack to support v7 async require
	frappe.call({
		method: "frappe.utils.change_log.get_versions",
		callback: function(r) {
			var requirements = [
				'/assets/bpmn_editor/js/bpmn-viewer.js'
			];
			if (cint(r.message.frappe.version.split('.')[0]) >= 7){
				frappe.require(requirements, init);
			} else {
				frappe.require(requirements);
				init();
			}
		}
	});

}

frappe.pages['bpmn-viewer'].refresh = function(wrapper){
	if (bpmn && bpmn.viewer){
		bpmn.viewer.set_from_route();
	}
}

$(window).resize(function(){
	if (window.bpmn.editor){
		window.bpmn.editor.resize();
	}
});

bpmn.Viewer = Class.extend({
	init: function(wrapper, page){
		this.wrapper = wrapper;
		this.page = page;
		$(frappe.render_template("bpmn-viewer", {})).appendTo(page.main);
		this.body = this.page.main.find('#canvas');
		this.resize();
		this.make();
		this.set_from_route();
	},
	make: function(){
		var BpmnViewer = window.BpmnJS, self = this;
		this.viewer = new BpmnViewer({container: '#canvas'});
		this.diagram = this.page.add_field({
			fieldname: "diagram",
			label: __("Diagram"),
			fieldtype: "Link",
			options: 'BPMN Diagram'
		});
		this.diagram.$input.on('change', function(){
			self.load_diagram();
		});
	},
	load_diagram: function(){
		var self = this;
		if (!this.diagram.$input.val()){
			this.body.hide();
		}
		frappe.call({
			'method': 'frappe.client.get_value',
			'args': {
				'doctype': 'BPMN Diagram',
				'filters': {
					'name': this.diagram.$input.val()
				},
				'fieldname': 'xml'
			},
			callback: function(res){
				if (res && res.message && !res.exc){
					if (!res.message.xml){
						res.message.xml = self.get_basic_diagram();
					}
					self.viewer.importXML(res.message.xml, function(err){
						if (err){
							self.body.hide();
							frappe.msgprint(err.message);
						} else {
							self.body.show();
						}
					});
				}
			}
		});
	},
	set_from_route: function(){
		var self = this;
		if (frappe.route_options && frappe.route_options.diagram && this.diagram){
			this.diagram.$input.val(frappe.route_options.diagram);
			frappe.route_options = null;
			this.diagram.$input.trigger('change');
		}
	},
	resize: function(){
		var page_container = this.body.closest('.page-container'),
			container = page_container.find('.container'),
			head = page_container.find('.page-head'),
			height = head.innerHeight() - 200; // Added 40px of the topbar and 60px of the layout footer;
		if (container.length){
			container.removeClass('container').addClass('container-fluid');
		}
		this.body.height(window.innerHeight - height);
	},

})
