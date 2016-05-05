# -*- coding: utf-8 -*-
from __future__ import unicode_literals

app_name = "bpmn_editor"
app_title = "BPMN Editor"
app_publisher = "MaxMorais"
app_description = "Editor of BPMN"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "max.morais.dmm@gmail.com"
app_version = "0.0.1"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/bpmn_editor/css/bpmn_editor.css"
# app_include_js = "/assets/bpmn_editor/js/bpmn_editor.js"

# include js, css files in header of web template
# web_include_css = "/assets/bpmn_editor/css/bpmn_editor.css"
# web_include_js = "/assets/bpmn_editor/js/bpmn_editor.js"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "bpmn_editor.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "bpmn_editor.install.before_install"
# after_install = "bpmn_editor.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "bpmn_editor.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"bpmn_editor.tasks.all"
# 	],
# 	"daily": [
# 		"bpmn_editor.tasks.daily"
# 	],
# 	"hourly": [
# 		"bpmn_editor.tasks.hourly"
# 	],
# 	"weekly": [
# 		"bpmn_editor.tasks.weekly"
# 	]
# 	"monthly": [
# 		"bpmn_editor.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "bpmn_editor.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "bpmn_editor.event.get_events"
# }

