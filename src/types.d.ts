export type FaustModuleFactory = EmscriptenModuleFactory<FaustModule>;

export interface FaustModule extends EmscriptenModule {
    ccall: typeof ccall;
    cwrap: typeof cwrap;
    UTF8ArrayToString(u8Array: number[], ptr: number, maxBytesToRead?: number): string;
    stringToUTF8Array(str: string, outU8Array: number[], outIdx: number, maxBytesToWrite: number): number;
    UTF8ToString: typeof UTF8ToString;
    UTF16ToString: typeof UTF16ToString;
    UTF32ToString: typeof UTF32ToString;
    stringToUTF8: typeof stringToUTF8;
    stringToUTF16: typeof stringToUTF16;
    stringToUTF32: typeof stringToUTF32;
    allocateUTF8: typeof allocateUTF8;
    lengthBytesUTF8: typeof lengthBytesUTF8;
    lengthBytesUTF16: typeof lengthBytesUTF16;
    lengthBytesUTF32: typeof lengthBytesUTF32;
    FS: typeof FS;
    libFaustWasm: new () => LibFaustWasm;
}

export type TFaustInfoType = "help" | "version" | "libdir" | "includedir" | "archdir" | "dspdir" | "pathslist";

export interface IntVector { size(): number; get(i: number): number; }

export interface FaustWasm {
    /* The C++ factory pointer as in integer */
    cfactory: number;
    /* The compiled wasm binary code */
    data: IntVector;
    /* The DSP JSON description */
    json: string;
}

export interface LibFaustWasm {
    /**
     * Return the Faust compiler version.
     * 
     * @returns the version
     */
    version(): string;

    /**
     * Create a dsp factory from Faust code.
     *
     * @param name - an arbitrary name for the Faust module
     * @param code - Faust dsp code
     * @param args - the compiler options
     * @param useInternalMemory - tell the compiler to generate static embedded memory or not
     * @returns an opaque reference to the factory
     */
    createDSPFactory(name: string, code: string, args: string, useInternalMemory: boolean): FaustWasm;

    /**
     * Delete a dsp factory.
     *
     * @param cFactory - the factory C++ internal pointer as a number
     */
    deleteDSPFactory(cFactory: number): void;

    /**
     * Expand Faust code i.e. linearize included libraries.
     *
     * @param name - an arbitrary name for the Faust module
     * @param code - Faust dsp code
     * @param args - the compiler options
     * @returns return the expanded dsp code
     */
    expandDSP(name: string, code: string, args: string): string

    /**
     * Generates auxiliary files from Faust code. The output depends on the compiler options.
     *
     * @param name - an arbitrary name for the faust module
     * @param code - Faust dsp code
     * @param args - the compiler options
     */
    generateAuxFiles(name: string, code: string, args: string): boolean;

    /**
     * Delete all existing dsp factories.
     */
    deleteAllDSPFactories(): void;

    /**
     * Exception management: gives an error string
     */
    getErrorAfterException(): string;

    /**
     * Exception management: cleanup
     * Should be called after each exception generated by the LibFaust methods.
     */
    cleanupAfterException(): void;

    /**
     * Get info about the embedded Faust engine
     * @param what - the requested info
     */
    getInfos(what: TFaustInfoType): string;
}

/**
 * The Factory structure.
 * cfactory: a "pointer" (as an integer) on the internal C++ factory 
 * code: the WASM code as a binary array
 * module: the compule WASM module
 * json: the compiled DSP JSON description
 * poly: whether the factory is a polyphonic one or not
 */
export interface FaustDspFactory {
    cfactory: number;
    code: Uint8Array;
    module: WebAssembly.Module;
    json: string;
    poly: boolean;
}

export interface FaustDspMeta {
    name: string;
    filename: string;
    compile_options: string;
    include_pathnames: string[];
    inputs: number;
    outputs: number;
    size: number;
    version: string;
    library_list: string[];
    meta: { [key: string]: string }[];
    ui: FaustUIDescriptor;
}

export type FaustUIDescriptor = IFaustUIGroup[];
export type IFaustUIItem = IFaustUIInputItem | IFaustUIOutputItem | IFaustUIGroup;
export interface IFaustUIInputItem {
    type: FaustUIInputType;
    label: string;
    address: string;
    index: number;
    init?: number;
    min?: number;
    max?: number;
    step?: number;
    meta?: IFaustUIMeta[];
}
export interface IFaustUIOutputItem {
    type: FaustUIOutputType;
    label: string;
    address: string;
    index: number;
    min?: number;
    max?: number;
    meta?: IFaustUIMeta[];
}
export interface IFaustUIMeta {
    [order: number]: string;
    style?: string; // "knob" | "menu{'Name0':value0;'Name1':value1}" | "radio{'Name0':value0;'Name1':value1}" | "led";
    unit?: string;
    scale?: "linear" | "exp" | "log";
    tooltip?: string;
    hidden?: string;
    [key: string]: string | undefined;
}
export type FaustUIGroupType = "vgroup" | "hgroup" | "tgroup";
export type FaustUIOutputType = "hbargraph" | "vbargraph";
export type FaustUIInputType = "vslider" | "hslider" | "button" | "checkbox" | "nentry";
export interface IFaustUIGroup {
    type: FaustUIGroupType;
    label: string;
    items: IFaustUIItem[];
}
export type FaustUIType = FaustUIGroupType | FaustUIOutputType | FaustUIInputType;

export interface AudioParamDescriptor {
    automationRate?: AutomationRate;
    defaultValue?: number;
    maxValue?: number;
    minValue?: number;
    name: string;
}

export interface AudioWorkletProcessor {
    port: MessagePort;
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}
export const AudioWorkletProcessor: {
    prototype: AudioWorkletProcessor;
    parameterDescriptors: AudioParamDescriptor[];
    new (options: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

export interface AudioWorkletGlobalScope {
    AudioWorkletGlobalScope: any;
    globalThis: AudioWorkletGlobalScope;
    registerProcessor: (name: string, constructor: new (options: any) => AudioWorkletProcessor) => void;
    currentFrame: number;
    currentTime: number;
    sampleRate: number;
    AudioWorkletProcessor: typeof AudioWorkletProcessor;
}
