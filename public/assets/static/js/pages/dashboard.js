!function (t) {
  "use strict";
  var e = t.fn.bootstrapTable.utils.sprintf, i = t.fn.bootstrapTable.utils.calculateObjectValue, r = function (e, i) {
    var r = "", a = "";
    null != i && (r = t.trim(i.id), a = t.trim(i.text)), e.append(t("<option></option>").attr("value", r).text(a));
  }, a = function (t) {
    var e = t.$header;
    return t.options.height && (e = t.$tableHeader), e;
  }, l = function (e) {
    var i = a(e).find("table select, table input");
    e.options.filterValues = [], i.each(function () {
      e.options.filterValues.push({ field: t(this).attr("name"), value: t(this).val() });
    });
  }, s = function (e) {
    var i = null, r = [], l = a(e).find("table select, table input");
    e.options.filterValues.length > 0 && l.each(function (a, l) {
      i = t(this).attr("name"), (r = t.grep(e.options.filterValues, function (t) {
        return t.field === i;
      })).length > 0 && (t(this).val(r[0].value), t(this).hasClass("filter-select") && t(this).select2("val", r[0].value));
    });
  }, o = function (e, i) {
    var l = [], s = [], o = t('<tr class="filter"></tr>'), n = 0;
    t.each(e.columns, function (t, i) {
      if (i.visible) if (i.filterType) {
        var r = i.filterType.toLowerCase();
        "server" !== e.options.sidePagination && (r = r.replace("_range", "")), i.searchable && e.options.filterTemplates[r] && (l[i.field] = '<th><div class="filter-inner">' + e.options.filterTemplates[r](e, i) + "</div></th>", "datepicker" == r && (s[i.field] = i.filterDatepickerOptions));
      } else l[i.field] = "<th></th>";
    }), t.each(i.children().children(), function (e, i) {
      var r = (i = t(i)).data("field");
      null != l[r] && void 0 !== l[r] ? o.append(l[r]) : o.append("<th></th>");
    }), o.insertAfter(a(e).find("tr")), console.log("that.options", e.options), a(e).find(".filter-select").length > 0 && a(e).find(".filter-select").each(function () {
      var i = t(this).data("searchable");
      switch (t(this).data("selectType")) {
        case"url":
          var a = t(this).data("url");
          t(this).select2({
            width: "100%",
            minimumResultsForSearch: i ? 1 : -1,
            ajax: {
              url: a, dataType: "json", quietMillis: 250, results: function (t, e) {
                return { results: t };
              }
            },
            escapeMarkup: function (t) {
              return t;
            }
          });
          break;
        case"var":
          var l = t(this).data("var"), s = window[l];
          for (var o in r(t(this), { id: "", text: e.options.formatFilterSelectLabel() }), s) r(t(this), s[o]);
          t(this).select2({ width: "100%", minimumResultsForSearch: i ? 1 : -1 });
      }
    }), "server" !== e.options.sidePagination && (a(e).off("keyup", "input").on("keyup", "input.filter-control", function (t) {
      clearTimeout(n), n = setTimeout(function () {
        e.onColumnSearch(t);
      }, e.options.searchTimeOut);
    }), a(e).off("change", "select").on("change", "select.filter-select", function (t) {
      clearTimeout(n), n = setTimeout(function () {
        e.onColumnSearch(t);
      }, e.options.searchTimeOut);
    }), a(e).off("mouseup", "input").on("mouseup", "input.filter-control", function (i) {
      var r = t(this);
      "" !== r.val() && setTimeout(function () {
        "" === r.val() && (clearTimeout(n), n = setTimeout(function () {
          e.onColumnSearch(i);
        }, e.options.searchTimeOut));
      }, 1);
    })), a(e).find("input.filter-datepicker").length > 0 && a(e).find("input.filter-datepicker").each(function () {
      t(this).datepicker(s[t(this).data("field")]).on("changeDate", function (e) {
        t(e.currentTarget).keyup();
      });
    });
  };
  t.extend(t.fn.bootstrapTable.defaults, {
    filter: !1, filterValues: [], onColumnSearch: function (t, e) {
      return !1;
    }, filterTemplates: {
      input: function (t, i) {
        return e('<input type="text" class="form-control filter-control" name="%s_filter" style="width: 100%;" data-field="%s" %s>', i.field, i.field, i.filterDisabled ? 'disabled="disabled"' : "");
      }, select: function (t, i) {
        if (void 0 === i.filterData) return "";
        var r = e('id="%s" class="filter-select filter-control" name="%s_filter"  style="width: 100%;" data-placeholder="%s" data-searchable="%s" data-field="%s" %s', i.field + "filter" + (a(t).find(".filter-select").length + 1), i.field, i.title, void 0 !== i.filterSelectSearchable && i.filterSelectSearchable, i.field, i.filterDisabled ? 'disabled="disabled"' : ""),
            l = i.filterData.substring(0, 3), s = i.filterData.substring(4, i.filterData.length);
        switch (l) {
          case"url":
            return e('<input type="hidden" value="" data-select-type="%s" data-url="%s" %s>', l, s, r);
          case"var":
            return e('<select data-select-type="%s" data-var="%s" %s></select>', l, s, r);
        }
      }, datepicker: function (t, i) {
        return e('<div class="input-group">    <input type="text"  placeholder="%s" class="form-control  filter-control filter-datepicker" name="%s_filter" data-field="%s" %s><span class="input-group-addon"><i class="fa fa-calendar"></i></span></div>', t.options.formatFilterDatepickerPlaceholder(), i.field, i.field, i.filterDisabled ? 'disabled="disabled"' : "");
      }, input_range: function (t, i) {
        var r = e('<input type="text" class="form-control mb5 filter-control" name="%s_from_filter" style="width: 100%;" data-field="%s" %s>', i.field, i.field, i.filterDisabled ? 'disabled="disabled"' : ""),
            a = e('<input type="text" class="form-control filter-control" name="%s_to_filter" style="width: 100%;" data-field="%s" %s>', i.field, i.field, i.filterDisabled ? 'disabled="disabled"' : "");
        return e("%s%s", r, a);
      }, select_range: function (t, i) {
        if (void 0 !== i.filterData) {
          var r = e('id="%s" style="width: 100%;" data-placeholder="-" data-searchable="%s" data-field="%s" %s', i.field + "filter" + (a(t).find(".filter-select").length + 1), void 0 !== i.filterSelectSearchable && i.filterSelectSearchable, i.field, i.filterDisabled ? 'disabled="disabled"' : ""),
              l = "", s = "", o = i.filterData.substring(0, 3), n = i.filterData.substring(4, i.filterData.length);
          switch (o) {
            case"url":
              l = e('<input type="hidden" value="" class="filter-select mb5 filter-control" data-select-type="%s" name="%s_from_filter" data-url="%s" %s>', o, i.field, n, r), s = e('<input type="hidden" value="" class="filter-select filter-control" data-select-type="%s" name="%s_to_filter" data-url="%s" %s>', o, i.field, n, r);
              break;
            case"var":
              l = e('<select class="filter-select mb5 filter-control" data-select-type="%s" name="%s_from_filter" data-var="%s" %s></select>', o, i.field, n, r), s = e('<select class="filter-select mb5 filter-control" data-select-type="%s" name="%s_to_filter" data-var="%s" %s></select>', o, i.field, n, r);
          }
          return e("%s%s", l, s);
        }
        return "";
      }, datepicker_range: function (t, i) {
        var r = e('<div class="input-group mb5">    <input type="text" placeholder="%s" class="form-control  filter-control filter-datepicker" name="%s_from_filter" data-field="%s" %s><span class="input-group-addon"><i class="fa fa-calendar"></i></span></div>', t.options.formatFilterDatepickerPlaceholderFrom(), i.field, i.field, i.filterDisabled ? 'disabled="disabled"' : ""),
            a = e('<div class="input-group">    <input type="text" placeholder="%s" class="form-control  filter-control filter-datepicker" name="%s_to_filter" data-field="%s" %s><span class="input-group-addon"><i class="fa fa-calendar"></i></span></div>', t.options.formatFilterDatepickerPlaceholderTo(), i.field, i.field, i.filterDisabled ? 'disabled="disabled"' : "");
        return e("%s%s", r, a);
      }
    }
  }), t.extend(t.fn.bootstrapTable.Constructor.EVENTS, { "column-search.bs.table": "onColumnSearch" }), t.extend(t.fn.bootstrapTable.defaults.icons, {
    filter: "fa-filter icon-filter",
    resetFilter: "fa-remove icon-reset-filter"
  }), t.extend(t.fn.bootstrapTable.locales["en-US"], {
    formatFilterDatepickerPlaceholder: function () {
      return "dd.mm.yyyy";
    }, formatFilterDatepickerPlaceholderFrom: function () {
      return "from dd.mm.yyyy";
    }, formatFilterDatepickerPlaceholderTo: function () {
      return "to dd.mm.yyyy";
    }, formatFilter: function () {
      return "Start filter";
    }, formatResetFilter: function () {
      return "Reset filter";
    }, formatFilterSelectLabel: function () {
      return "All";
    }
  }), t.extend(t.fn.bootstrapTable.defaults, t.fn.bootstrapTable.locales), t.extend(t.fn.bootstrapTable.COLUMN_DEFAULTS, {
    filterType: void 0,
    filterData: void 0,
    filterSelectSearchable: !1,
    filterDatepickerOptions: { dateFormat: "dd.mm.yy" },
    filterDisabled: !1,
    filterStrictSearch: !0
  });
  var n = t.fn.bootstrapTable.Constructor, f = n.prototype.init, c = n.prototype.initToolbar,
      d = n.prototype.initHeader, p = n.prototype.initSearch, u = n.prototype.fitHeader, h = n.prototype.refresh;
  n.prototype.init = function () {
    if (this.options.filter) {
      var t = this;
      this.$el.on("reset-view.bs.table", function () {
        t.options.height && s(t);
      });
    }
    f.apply(this, Array.prototype.slice.apply(arguments));
  }, n.prototype.initHeader = function () {
    d.apply(this, Array.prototype.slice.apply(arguments)), this.options.filter && (this.options.height || (o(this, this.$header), this.$tableLoading.css("top", this.$header.outerHeight() + 1)));
  }, n.prototype.fitHeader = function () {
    if (u.apply(this, Array.prototype.slice.apply(arguments)), this.options.filter) {
      var t = 0;
      o(this, this.$header), s(this), this.$tableLoading.css("top", this.$tableHeader.outerHeight() + 1), t += this.$tableHeader.outerHeight(), this.options.showFooter && (t += this.$tableFooter.outerHeight() + 1), this.$tableContainer.css("padding-bottom", t + "px");
    }
  }, n.prototype.refresh = function (e) {
    if (this.options.filter) {
      var r = i(this.options, this.$el.data("queryParams"), (s = {}, a(this).find("select.filter-control, input.filter-control").each(function () {
        var e = t(this).attr("name"), i = t(this).val();
        s[e] = i;
      }), [ s ]), []);
      this.options.queryParams = function (e) {
        return t.extend(e, r), e;
      }, this.options.height && l(this);
    }
    var s;
    h.apply(this, Array.prototype.slice.apply(arguments));
  }, n.prototype.initToolbar = function () {
    if (!this.showToolbar && this.options.filter && (this.showToolbar = this.options.filter), c.apply(this, Array.prototype.slice.apply(arguments)), this.options.filter) {
      var i, r, a = t('<div class="columns columns-right btn-group pull-right"></div>');
      "server" === this.options.sidePagination && (i = t([ '<button class="btn btn-default" ', e('type="button" title="%s">', this.options.formatFilter()), e('<i class="%s %s"></i> ', this.options.iconsPrefix, this.options.icons.filter), "</button>", "</ul>" ].join("")).appendTo(a)), r = t([ '<button class="btn btn-default" ', e('type="button" title="%s">', this.options.formatResetFilter()), e('<i class="%s %s"></i> ', this.options.iconsPrefix, this.options.icons.resetFilter), "</button>", "</ul>" ].join("")).appendTo(a), a.appendTo(this.$toolbar), "server" === this.options.sidePagination && i.off("click").on("click", t.proxy(this.refresh, this)), r.off("click").on("click", t.proxy(this.resetFilter, this));
    }
  }, n.prototype.resetFilter = function () {
    if (this.options.filter) {
      if (t.each(this.options.filterValues, function (t, e) {
        e.value = "";
      }), s(this), a(this).find("input.filter-control").each(function () {
        t(this).val("");
      }), a(this).find("select.filter-control").each(function () {
        t(this).select2("val", "");
      }), "server" === this.options.sidePagination) this.refresh(); else {
        var e = a(this).find("select.filter-control, input.filter-control"),
            i = (this.$header.closest("table"), this.$toolbar.find(".search input"));
        e.length > 0 && (this.filterColumnsPartial = {}, t(e[0]).trigger("INPUT" === e[0].tagName ? "keyup" : "change")), i.length > 0 && that.resetSearch();
      }
    }
  }, n.prototype.onColumnSearch = function (e) {
    l(this);
    var i = t.trim(t(e.currentTarget).val()), r = t(e.currentTarget).closest("[data-field]").data("field");
    t.isEmptyObject(this.filterColumnsPartial) && (this.filterColumnsPartial = {}), i ? this.filterColumnsPartial[r] = i : delete this.filterColumnsPartial[r], this.options.pageNumber = 1, this.onSearch(e), this.updatePagination(), this.trigger("column-search", r, i);
  }, n.prototype.initSearch = function () {
    if (p.apply(this, Array.prototype.slice.apply(arguments)), "server" !== !this.options.sidePagination) {
      var e = this, i = t.isEmptyObject(this.filterColumnsPartial) ? null : this.filterColumnsPartial;
      this.data = i ? t.grep(this.data, function (r, a) {
        for (var l in i) {
          var s = e.columns[t.fn.bootstrapTable.utils.getFieldIndex(e.columns, l)], o = i[l].toLowerCase(), n = r[l];
          if (s && s.searchFormatter && (n = t.fn.bootstrapTable.utils.calculateObjectValue(e.header, e.header.formatters[t.inArray(l, e.header.fields)], [ n, r, a ], n)), s.filterStrictSearch) {
            if (-1 === t.inArray(l, e.header.fields) || "string" != typeof n && "number" != typeof n || n.toString().toLowerCase() !== o.toString().toLowerCase()) return !1;
          } else if (-1 === t.inArray(l, e.header.fields) || "string" != typeof n && "number" != typeof n || -1 === (n + "").toLowerCase().indexOf(o)) return !1;
        }
        return !0;
      }) : this.data;
    }
  };
}(jQuery);