import style from './style';
import { EventHandler } from './EventHandler';
import { browser } from './utils';

const MAX_SCROLL = browser.heightLimit - 1000;

export class Scrollable {
	private _handler: EventHandler;
	private _scrollable: HTMLDivElement;
	private _height: number;
	private _width: number;
	private _endPointElement: HTMLDivElement;
	private _p = 1;
	private _canvas : HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		this._handler = new EventHandler();
		this._canvas = canvas ;


		this._scrollable = document.createElement('div');
		this._scrollable.classList.add('grid-scrollable');
		this._height = 0;
		this._width = 0;

		this._p = 1;

		this._endPointElement = document.createElement('div');
		this._endPointElement.classList.add('grid-scroll-end-point');
		this._update();
		this._scrollable.appendChild(this._endPointElement);

		// const mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? 'DOMMouseScroll' : 'mousewheel'; //FF doesn't recognize mousewheel as of FF3.x
		// this._handler.on(this._scrollable, mousewheelevt, (evt) => {
		// const delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta;
		// const point = Math.min(Math.abs(delta) / 12, this.scrollHeight / 5);
		// this.scrollTop += delta < 0 ? point : -point;
		// });
	}

	calcTop(top: number): number {
		const relativeTop = top - this.scrollTop;
		return this._scrollable.scrollTop + relativeTop;
	}

	getElement(): HTMLDivElement {
		return this._scrollable;
	}

	setScrollSize(width: number, height: number): void {
		this._width = width;
		this._height = height;
		this._update();
	}

	get scrollWidth(): number {
		return this._width;
	}

	set scrollWidth(width: number) {
		this._width = width;
		this._update();
	}

	get scrollHeight(): number {
		return this._height;
	}

	set scrollHeight(height: number) {
		this._height = height;
		this._update();
	}

	get scrollLeft(): number {
		return Math.max(Math.ceil(this._scrollable.scrollLeft), 0);
	}

	set scrollLeft(scrollLeft: number) {
		this._scrollable.scrollLeft = scrollLeft;
	}

	get scrollTop(): number {
		return Math.max(Math.ceil(this._scrollable.scrollTop / this._p), 0);
	}

	set scrollTop(scrollTop: number) {
		this._scrollable.scrollTop = scrollTop * this._p;
	}

	onScroll(fn: (evt: Event) => void): void {
		this._handler.on(this._scrollable, 'scroll', fn);
	}

	dispose(): void {
		this._handler.dispose();
	}
	public update() {
		this._update();
	}
	private _update() {
		let domHeight;
		const sbSize = style.getScrollBarSize();
		if (this._height > MAX_SCROLL) {
			const offsetHeight = this._scrollable.offsetHeight;
			const vScrollRange = MAX_SCROLL - offsetHeight + sbSize;
			const rScrollRange = this._height - offsetHeight + sbSize;
			this._p = vScrollRange / rScrollRange;
			domHeight = MAX_SCROLL;
		} else {
			this._p = 1;
			domHeight = this._height;
		}
		const domWidth = this._width;

		// TODO: windows 下横纵滚动条都存在时，显示多余空白问题
		// const isWindows = /windows|win32/i.test(window.navigator.userAgent);
		const top = domHeight > this._canvas.height ? domHeight : domHeight - sbSize;
		const left = domWidth > this._canvas.width ? domWidth : domWidth - sbSize;

		this._endPointElement.style.top = `${top.toFixed()}px`;
		this._endPointElement.style.left = `${left.toFixed()}px`;

		// 不让滚动条位置超出范围
		const maxScrollTop = Math.max(0, top - this._canvas.height);
		if (this._scrollable.scrollTop > maxScrollTop) {
			this._scrollable.scrollTop = maxScrollTop;
		}
		const maxScrollLeft = Math.max(0, left - this._canvas.width);
		if (this._scrollable.scrollLeft > maxScrollLeft) {
			this._scrollable.scrollLeft = maxScrollLeft;
		}
	}

	/*private _update(): void {
		let domHeight;
		if (this._height > MAX_SCROLL) {
			const sbSize = style.getScrollBarSize();
			const { offsetHeight } = this._scrollable;
			const vScrollRange = MAX_SCROLL - offsetHeight + sbSize;
			const rScrollRange = this._height - offsetHeight + sbSize;
			this._p = vScrollRange / rScrollRange;
			domHeight = MAX_SCROLL;
		} else {
			this._p = 1;
			domHeight = this._height;
		}

		this._endPointElement.style.top = `${ domHeight.toFixed() }px`;
		this._endPointElement.style.left = `${ this._width.toFixed() }px`;
	}*/
}
