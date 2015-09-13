class Application {
    private _iframe: HTMLIFrameElement;

    public activate(state) {
        var workspace: HTMLElement = <any>atom.views.getView(atom.workspace);

        atom.commands.add('atom-workspace', 'atom-presentation:toggle', () => {
            workspace.classList.toggle('atom-presentation');
        });

        atom.commands.add('atom-workspace', 'atom-presentation:show', () => {
            if (!this._iframe) {
                this._iframe = document.createElement('iframe');
                this._iframe.src = 'http://localhost:1948/client';
                this._iframe.style.visibility = 'hidden';
                this._iframe.style.width = '100%';
                this._iframe.style.height = '100%';
                this._iframe.style.position = 'fixed';
                this._iframe.style.left = this._iframe.style.right = this._iframe.style.top = this._iframe.style.bottom = '0';
                this._iframe.style.border = '0px solid black';
                document.body.appendChild(this._iframe);

                this._iframe.onload = () => {
                    this._iframe.style.visibility = '';
                }
            } else {
                this._iframe.style.display = '';
            }

            atom.setFullScreen(true);
            atom.setAutoHideMenuBar(true);
            workspace.style.visibility = 'hidden';
            this._iframe.focus();

            workspace.classList.add('atom-presentation');
        });

        atom.commands.onWillDispatch(e => e.type === "window:toggle-full-screen" && atom.commands.dispatch(workspace, 'atom-presentation:hide'));

        atom.commands.add('atom-workspace', 'atom-presentation:hide', () => {
            if (this._iframe) {
                this._iframe.style.display = 'none';
                workspace.style.visibility = '';
                workspace.focus();
                atom.setAutoHideMenuBar(false);
            }
        });

        var zoom = 1;
        var idealFontSize = 11;

        function setZoom(zoom: number) {
            atom.config.set('editor.fontSize', Math.floor(idealFontSize + (idealFontSize * zoom / 10)));
            workspace.style.zoom = (1 + zoom / 10).toString();
            for (var item of <HTMLElement[]>Array.prototype.slice.call(document.querySelectorAll('.item-views'))) {
                item.style.zoom = 'reset';
            }
        }

        atom.commands.add('atom-workspace', 'atom-presentation:zoom-plus', () => {
            zoom = zoom + 1;
            setZoom(zoom);
        });

        atom.commands.add('atom-workspace', 'atom-presentation:zoom-minus', () => {
            zoom = zoom - 1;
            setZoom(zoom);
        });
    }
}

export = new Application();
