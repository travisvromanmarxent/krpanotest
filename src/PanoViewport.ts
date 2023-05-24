import * as KRPano from '../vendor/krpano'; // 1.21 file
// NOTE: comment the line above and uncomment the line below to see this work.
// import * as KRPano from '../vendor/krpano-working'; // 1.20.11 file

/**
 * Represents the options for a pano viewer.
 */
export interface PanoOptions {
    /** Indicates if the viewer should be launched in debug mode. */
    debugMode?: boolean;
    /** The URL for the fullscreen button's icon. Text is used if left undefined. */
    fullscreenIconUrl?: string;
    /** The URL for the exit fullscreen button's icon. Text is used if left undefined. */
    exitFullscreenIconUrl?: string;
    /** The URL for the VR button's icon. Text is used if left undefined. */
    vrIconUrl?: string;
    /** The URL for the gyro button's icon. Text is used if left undefined. */
    gyroIconUrl?: string;
    /** The URL for the gyro button's active icon. Text is used if left undefined. */
    gyroToggledOnIconUrl?: string;
    /** Indicates if fullscreen mode should be enabled (if available). */
    fullscreenEnabled: boolean;
    /** Indicates if VR mode should be enabled (if available). */
    vrEnabled: boolean;
    /** Indicates if gyroscopic functionality should be enabled (if available). */
    gyroEnabled: boolean;
    /** If not provided, defaults to on */
    gyroDefault?: boolean;
}

/**
 * The main class through which all pano viewing functions should pass.
 */
export class PanoViewport {
    // Keep a running instance count for id uniqueness.
    private static _instanceCount: number = 0;

    // A unique instance identifier.
    private _instanceId: number;
    private _parentElement: HTMLElement;
    private _container: HTMLElement | undefined;
    private _target: HTMLElement | undefined;
    private _krpanoInterfaceObj: any;
    private _krpanoGlobalAPI: any;

    /**
     * Creates the viewer using the provided options.
     * @param options The options to be used when creating the viewer.
     */
    public constructor(public options: PanoOptions) {
        if (this.options.gyroDefault == undefined) {
            this.options.gyroDefault = true;
        }
        this.options.debugMode = true; // nocheckin
        this._instanceId = PanoViewport._instanceCount;
        PanoViewport._instanceCount++;

        (window as any).pv = this;
    }

    /**
     * Returns a new pano viewport, created with a copy of the options
     * used to create this viewport.
     *
     * @returns A new pano viewport.
     */
    public clone(): PanoViewport {
        return new PanoViewport({ ...this.options });
    }

    /**
     * Obtains a reference to the internal container element. This can be used
     * to add controls, etc. to the view.
     */
    public getContainer(): HTMLElement | undefined {
        return this._container;
    }

    /**
     * Initializes the viewport and inserts it into the configured parent element.
     */
    public initialize(parentElement: HTMLElement): void {
        if (!parentElement) {
            throw 'Cannot initialize pano viewport without a parent element.';
        }

        this._parentElement = parentElement;

        // Create wrapper and target elements.
        this._container = document.createElement('div');
        this._container.classList.add('pano-container');
        // The target for the pano to embed into.
        this._target = document.createElement('div');

        const targetId = 'pano_' + this._instanceId;
        this._target.id = targetId;
        this._target.classList.add('pano');
        this._container.appendChild(this._target);
        this._parentElement.appendChild(this._container);

        // NOTE: Passing null to xml (a required field) just makes it not load anything initially.
        // KRPano
        KRPano.embedpano({
            xml: null,
            target: targetId,
            html5: 'only+webgl',
            mobilescale: 1.0,
            onready: this.krpanoOnReady.bind(this),
            onerror: this.krpanoOnError.bind(this),
            consolelog: true,
            debugmode: true,
            usestrictjs: false,
        });
    }

    /**
     * Loads a pano scene using the provided image URL.
     * @param imageUrl The image url to be loaded.
     */
    public loadPano(imageUrl: string): void {
        let krpanoApi = this._krpanoInterfaceObj.get('global');

        let xmlContent = `<krpano debugMode="${this.options.debugMode ? this.options.debugMode.toString() : 'false'}">
            <view fovtype="VFOV" fov="80" fovmin="40" fovmax="150"/>
            <preview url="${imageUrl}"/>
            <!-- The image that will be displayed in the pano. -->
            <image>
                <sphere url="${imageUrl}"/>
            </image>`;

        
        xmlContent += '</krpano>';
        krpanoApi.actions.loadxml(xmlContent);
    }

    /**
     * Invoked once the first time the krpano library notifies that it is ready.
     * @param krpanoInterface The kr pano interface
     */
    private krpanoOnReady(krpanoInterface: any) {
        // Store the interface object globally for easy access.
        this._krpanoInterfaceObj = krpanoInterface;
        // Store the API object.
        this._krpanoGlobalAPI = this._krpanoInterfaceObj.get('global');

        console.warn('Pano viewer library is ready.');
    }

    private krpanoOnError(error: any): void {
        console.warn('Error in krpano: ', error);
    }

    

}
