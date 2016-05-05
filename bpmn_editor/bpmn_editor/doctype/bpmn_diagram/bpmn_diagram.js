// Copyright (c) 2016, MaxMorais and contributors
// For license information, please see license.txt

frappe.ui.form.on('BPMN Diagram', {
	refresh: function(frm) {
		if (!frm.doc.__islocal){
			frm.add_custom_button(__('Edit'), function(){
				frappe.route_options = {
					diagram: frm.doc.name
				};
				frappe.set_route('bpmn-editor');
			});
			if (frm.doc.xml){
				frm.add_custom_button(__('View'), function(){
					frappe.route_options = {
						diagram: frm.doc.name
					};
					frappe.set_route('bpmn-viewer');
				})
			}
		}
	}
});
