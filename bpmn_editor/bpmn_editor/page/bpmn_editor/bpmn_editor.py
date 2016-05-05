
from __future__ import unicode_literals

import frappe

@frappe.whitelist()
def update_fields(name, svg, xml):
	for field, value in (('svg', svg), ('xml', xml)):
		frappe.db.set_value('BPMN Diagram', name, field, value)
