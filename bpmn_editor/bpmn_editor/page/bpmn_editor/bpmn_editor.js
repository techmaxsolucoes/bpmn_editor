frappe.provide("bpmn");
frappe.pages['bpmn-editor'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'BPMN Editor',
		single_column: true
	});

	function init(){
		bpmn.editor = new bpmn.Editor(wrapper, page);
	}

	// hack to support v7 async require
	frappe.call({
		method: "frappe.utils.change_log.get_versions",
		callback: function(r) {
			var requirements = [
				'/assets/bpmn_editor/js/assets/diagram-js.css',
				'/assets/bpmn_editor/js/assets/bpmn-font/css/bpmn-embedded.css',
				'/assets/bpmn_editor/js/bpmn-modeler.js',
			];
			if (cint(r.message.frappe.version.split('.')[0]) >= 7){
				frappe.require(requirements, init)
			} else {
				frappe.require(requirements);
				init();
			}
		}
	});
}

frappe.pages['bpmn-editor'].refresh = function(wrapper){
	if (bpmn && bpmn.editor){
		bpmn.editor.set_from_route();
	}
}

$(window).resize(function(){
	if (window.bpmn.editor){
		window.bpmn.editor.resize();
	}
});

frappe.provide('bpmn');
bpmn.Editor = Class.extend({
	init: function(wrapper, page){
		this.page = page;
		$(frappe.render_template("bpmn-editor", {})).appendTo(page.main);
		this.body = this.page.main.find('#canvas');
		this.resize();
		this.make();
		this.set_from_route();
	},
	make: function(){
		var BpmnModeler = window.BpmnJS, self = this;
		this.modeler = new BpmnModeler({container: '#canvas'});
		this.diagram = this.page.add_field({
			fieldname: "diagram",
			label: __("Diagram"),
			fieldtype: "Link",
			options: 'BPMN Diagram'
		});
		this.diagram.$input.on('change', function(){
			self.load_diagram();
		});
		this.save = this.page.add_action_item(__('Save'), function(){
			self.save_diagram();
		}, true)
		this.save.hide();
	},
	load_diagram: function(){
		var self = this;
		if (!this.diagram.$input.val()){
			this.body.hide();
			this.save.hide();
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
					self.modeler.importXML(res.message.xml, function(err){
						if (err){
							self.body.hide();
							self.save.hide();
							frappe.msgprint(err.message);
						} else {
							self.body.show();
							self.save.show();
						}
					});
				}
			}
		});
	},
	save_diagram: function(){
		var svg, xml, msg, self = this;
		this.modeler.saveSVG(function(){
			svg = arguments[1];
			msg = arguments[0];
		});
		this.modeler.saveXML(function(){
			xml = arguments[1];
			msg = arguments[0];
		});

		if (msg && (!svg || !xml)){
			frappe.throw(msg.message);
		} else {
			frappe.confirm(
				format(__('Do you want save the diagram {0}'),[this.diagram.$input.val()]),
				function(){
					frappe.call({
						'method': 'bpmn_editor.bpmn_editor.page.bpmn_editor.bpmn_editor.update_fields',
						'args': {
							'name': self.diagram.$input.val(),
							'svg': svg,
							'xml': xml
						},
						callback: function(){
							alert(__('Done'));
						}
					});
				}
			)
		}

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
	get_basic_diagram: function(){
		return '<?xml version="1.0" encoding="UTF-8"?>' +
  '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                    'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                    'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                    'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
                    'targetNamespace="http://bpmn.io/schema/bpmn" ' +
                    'id="Definitions_1">' +
    '<bpmn:process id="Process_1" isExecutable="false">' +
      '<bpmn:startEvent id="StartEvent_1"/>' +
    '</bpmn:process>' +
    '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
      '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
        '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
          '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' +
        '</bpmndi:BPMNShape>' +
      '</bpmndi:BPMNPlane>' +
    '</bpmndi:BPMNDiagram>' +
  '</bpmn:definitions>';
	}
});
