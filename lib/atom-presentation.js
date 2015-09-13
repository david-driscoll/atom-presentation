var Application = (function () {
    function Application() {
    }
    Application.prototype.activate = function (state) {
        var _this = this;
        var workspace = atom.views.getView(atom.workspace);
        atom.commands.add('atom-workspace', 'atom-presentation:toggle', function () {
            workspace.classList.toggle('atom-presentation');
        });
        atom.commands.add('atom-workspace', 'atom-presentation:show', function () {
            if (!_this._iframe) {
                _this._iframe = document.createElement('iframe');
                _this._iframe.src = 'http://localhost:1948/client';
                _this._iframe.style.visibility = 'hidden';
                _this._iframe.style.width = '100%';
                _this._iframe.style.height = '100%';
                _this._iframe.style.position = 'fixed';
                _this._iframe.style.left = _this._iframe.style.right = _this._iframe.style.top = _this._iframe.style.bottom = '0';
                _this._iframe.style.border = '0px solid black';
                document.body.appendChild(_this._iframe);
                _this._iframe.onload = function () {
                    _this._iframe.style.visibility = '';
                };
            }
            else {
                _this._iframe.style.display = '';
            }
            atom.setFullScreen(true);
            atom.setAutoHideMenuBar(true);
            workspace.style.visibility = 'hidden';
            _this._iframe.focus();
            workspace.classList.add('atom-presentation');
        });
        atom.commands.onWillDispatch(function (e) { return e.type === "window:toggle-full-screen" && atom.commands.dispatch(workspace, 'atom-presentation:hide'); });
        atom.commands.add('atom-workspace', 'atom-presentation:hide', function () {
            if (_this._iframe) {
                _this._iframe.style.display = 'none';
                workspace.style.visibility = '';
                workspace.focus();
                atom.setAutoHideMenuBar(false);
            }
        });
        var zoom = 1;
        var idealFontSize = 11;
        function setZoom(zoom) {
            atom.config.set('editor.fontSize', Math.floor(idealFontSize + (idealFontSize * zoom / 10)));
            workspace.style.zoom = (1 + zoom / 10).toString();
            for (var _i = 0, _a = Array.prototype.slice.call(document.querySelectorAll('.item-views')); _i < _a.length; _i++) {
                var item = _a[_i];
                item.style.zoom = 'reset';
            }
        }
        atom.commands.add('atom-workspace', 'atom-presentation:zoom-plus', function () {
            zoom = zoom + 1;
            setZoom(zoom);
        });
        atom.commands.add('atom-workspace', 'atom-presentation:zoom-minus', function () {
            zoom = zoom - 1;
            setZoom(zoom);
        });
    };
    return Application;
})();
module.exports = new Application();
