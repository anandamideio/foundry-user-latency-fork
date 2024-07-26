/// <reference types="@types/node" />
import JQuery from 'jquery';
import { EventEmitter } from 'events';


declare module '*.module.css'
declare interface moduleStyle {
  userSpan: string;
  userSpanHidden: string;
  userSpanGood: string;
  userSpanLow: string;
  userSpanBad: string;
  microLatency: string;
}

export default moduleStyle;

interface RollTables {
}

interface Users {
}

/**
 * A simple event framework used throughout Foundry Virtual Tabletop.
 * When key actions or events occur, a "hook" is defined where user-defined callback functions can execute.
 * This class manages the registration and execution of hooked callback functions.
 */
declare class HooksClass {
  /**
   * Register a callback handler for an event which is only triggered once the first time the event occurs.
   * An alias for Hooks.on with {once: true}
   * @param hook - The unique name of the hooked event
   * @param fn - The callback function which should be triggered when the hook event occurs
   * @returns An ID number of the hooked function which can be used to turn off the hook later
   */
  static once(hook: string, fn: Function): number;

  /**
   * Register a callback handler for an event.
   * @param hook - The unique name of the hooked event
   * @param fn - The callback function which should be triggered when the hook event occurs
   * @param options - Additional options to configure the hook
   * @returns An ID number of the hooked function which can be used to turn off the hook later
   */
  static on(hook: string, fn: Function, options?: { once?: boolean }): number;

  /**
   * Remove a callback handler for an event.
   * @param hook - The unique name of the hooked event
   * @param id - The ID number of the hooked function to remove
   */
  static off(hook: string, id: number): void;

  /**
   * Call all hooked functions for a given event.
   * @param hook - The unique name of the hooked event
   * @param args - Additional arguments to pass to the hooked functions
   */
  static callAll(hook: string, ...args: any[]): void;

  /**
   * Notify subscribers that an error has occurred within foundry.
   * @param location - The method where the error was caught.
   * @param error - The error.
   * @param options - Additional options to configure behaviour.
   * @param options.msg - A message which should prefix the resulting error or notification.
   * @param options.log - The level at which to log the error to console (if at all).
   * @param options.notify - The level at which to spawn a notification in the UI (if at all).
   * @param options.data - Additional data to pass to the hook subscribers.
   */
  static onError(
    location: string,
    error: Error,
    options?: {
      msg?: string;
      log?: string | null;
      notify?: string | null;
      data?: object;
    }
  ): void;
}

/**
 * A class representing the storage interface for world settings.
 */
declare class WorldSettings {
  constructor(worldSettings: any);
  // Define properties and methods for WorldSettings as needed
}
/**
 * A class representing the configuration for a specific setting.
 */
declare class SettingsConfig {
  // Define properties and methods for SettingsConfig as needed
}

/**
 * A class responsible for managing defined game settings or settings menus.
 * Each setting is a string key/value pair belonging to a certain namespace and a certain store scope.
 *
 * When Foundry Virtual Tabletop is initialized, a singleton instance of this class is constructed within the global Game object as game.settings
 */
declare class _ClientSettings {
  settings: Map<string, SettingsConfig>;

  /**
   * Register a new setting.
   *
   * @param {string} namespace - The namespace under which the setting is registered.
   * @param {string} key - The key for the setting.
   * @param {object} data - The configuration data for the setting.
   * @throws {Error} If the namespace or key is not specified.
   */
  public register(namespace: string, key: string, data: {
    type: foundry.data.fields.DataField | foundry.data.abstract.DataModel | Function;
    default?: any;
    onChange?: (value: any) => void;
    scope?: "client" | "world";
    label?: string;
    hint?: string;
    name?: string;
    config?: unknown;
  } & Record<string, unknown>): void;

  /**
    * Register a new sub-settings menu.
    *
    * @param {string} namespace - The namespace under which the menu is registered.
    * @param {string} key - The key for the menu.
    * @param {object} data - The configuration data for the menu.
    */
  registerMenu(namespace: string, key: string, data: {
    name: string;
    label: string;
    hint: string;
    icon: string;
    type: Function;
    restricted: boolean;
  }): void;

  /**
   * Registered settings menus which trigger secondary applications
   * @type {Map<string, SettingsConfig>}
   */
  menus: Map<string, SettingsConfig>;

  /**
   * The storage interfaces used for persisting settings
   * Each storage interface shares the same API as window.localStorage
   */
  storage: Map<string, Storage>;

  get<ExpectedReturn = any>(namespace: string, key: string): ExpectedReturn;

  /**
   * Set the value of a setting.
   *
   * @param {string} key - The key of the setting to set.
   * @param {any} value - The value to set for the setting.
   */
  set(key: string, value: any): void;

  /**
   * Reset a setting to its default value.
   *
   * @param {string} key - The key of the setting to reset.
   */
  reset(key: string): void;

  /**
 * Get all settings within a namespace.
 *
 * @param {string} namespace - The namespace to retrieve settings from.
 * @returns {object} An object containing all settings within the namespace.
 */
  getNamespace(namespace: string): object;

  /**
   * Get all registered settings.
   *
   * @returns {Map<string, any>} A map of all registered settings.
   */
  getAllSettings(): Map<string, any>;
}

/** A mixin that adds event emitter capabilities to a class */
declare const EventEmitterMixin: <T extends new (...args: any[]) => Record<any, any>>(base: T) => T & EventEmitter;

declare class Game {
  /**
     * Localization support.
     * @type {Localization}
     */
  i18n: Localization;
  /** The current game version */
  version: string;
  /** The current game build */
  build: string;
  date: string;
  settings: _ClientSettings;
  users: Users;
  rollTables: RollTables;
  constructor();
  start(): void;
  stop(): void;
  socket: SocketInterface;
  /**
     * Request World data from server and return it.
     * @param socket The active socket connection.
     * @param view The view for which data is being requested.
     * @returns A promise that resolves to the requested world data.
     */
  static getData(socket: SocketInterface, view: string): Promise<object>;

  /**
   * Get the current World status upon initial connection.
   * @param socket The active client socket connection.
   * @returns A promise that resolves to a boolean indicating the world status.
   */
  static getWorldStatus(socket: SocketInterface): Promise<boolean>;

  /**
   * Place a buffered socket event into the queue.
   * @param args Arguments of the socket event.
   */
  static bufferSocketEvents(...args: [string, ...any]): void;

  /**
   * Apply the queue of buffered socket events to game data once the game is ready.
   */
  static applyBufferedSocketEvents(): void;

  /**
   * Activate Socket event listeners which are used to transact game state data with the server.
   */
  activateSocketListeners(): void;

  /**
   * Handle a hot reload request from the server.
   * @param data The hot reload data.
   */
  private handleHotReload(data: Game.HotReloadData): void;

  /**
   * Handle hot reloading of CSS files.
   * @param data The hot reload data.
   */
  private hotReloadCSS(data: Game.HotReloadData): void;

  /**
   * Handle hot reloading of HTML files, such as Handlebars templates.
   * @param data The hot reload data.
   */
  private hotReloadHTML(data: Game.HotReloadData): void;

  /**
   * Handle hot reloading of JSON files, such as language files.
   * @param data The hot reload data.
   */
  private hotReloadJSON(data: Game.HotReloadData): void;
}

declare namespace Game {
  /**
   * @typedef HotReloadData
   * @property {string} packageType The type of package which was modified.
   * @property {string} packageId The id of the package which was modified.
   * @property {string} content The updated stringified file content.
   * @property {string} path The relative file path which was modified.
   * @property {string} extension The file extension which was modified, e.g. "js", "css", "html".
   */
  interface HotReloadData {
    packageType: string;
    packageId: string;
    content: string;
    path: string;
    extension: string;
  }
}

declare global {
  export const game: Game;
  export const Hooks: typeof HooksClass;
}

/**
 * Options which configure the behavior of a data field.
 */
interface DataFieldOptions {
  required?: boolean;
  nullable?: boolean;
  initial?: any;
  validate?: (value: any) => boolean;
  validationError?: string;
}

interface DataFieldContext {
  parent?: foundry.data.fields.DataField;
}

interface DataValidationOptions {
  strict?: boolean;
  fallback?: boolean;
  partial?: boolean;
  dropInvalidEmbedded?: boolean;
}

declare namespace foundry {
  export namespace client {
    export namespace core {
      /** The ClientSettings class manages the registration, storage, and retrieval of client-side settings */
      export const ClientSettings: _ClientSettings;
    }

    export namespace data {
      export namespace fields {
        export class BooleanField {
          constructor(options: { initial: boolean });
        }

        export class NumberField {
          constructor(options: { required: boolean; min: number; max: number; step: number; initial: number });
        }

        export class StringField {
          constructor(options: { required: boolean; blank: boolean; initial: string; choices: () => Record<string, string> });
        }
      }

      export namespace abstract {
        export class DataModel {
          /**
           * @param {object} [record={}] Initial data used to construct the data object. The provided object
           * will be owned by the constructed model instance and may be mutated.
           * @param {DataValidationOptions} [options={}] Options which affect DataModel construction
           * @param {Document} [options.parent] A parent DataModel instance to which this DataModel belongs
           */
          constructor(record?: object, options?: DataValidationOptions & { parent?: Document });

          /**
           * Initialize the source data for the DataModel.
           * @param {object} record The initial data object.
           * @param {DataValidationOptions} [options={}] Options which affect DataModel construction.
           * @returns {object} The initialized data object.
           */
          protected _initializeSource(record: object, options?: DataValidationOptions): object;

          /**
           * Migrate old data to the new format.
           * @param {object} record The data to migrate.
           * @returns {object} The migrated data.
           */
          static migrateDataSafe(record: object): object;

          /**
           * Clean the data in the new format.
           * @param {object} record The data to clean.
           * @returns {object} The cleaned data.
           */
          static cleanData(record: object): object;

          /**
           * Apply shims which preserve backwards compatibility.
           * @param {object} record The data to shim.
           * @returns {object} The shimmed data.
           */
          static shimData(record: object): object;
        }
      }
    }

    export namespace config {
      export interface ReleaseData {
        version: string;
        build: string;
        date: string;
      }
    }

    export namespace utils {
      export class Color {
        // Define the structure of Color here
      }

      export class Collection {
        // Define the structure of Collection here
      }
    }
  }

  export namespace data {
    export namespace abstract {
      export abstract class DataModel {
        /**
         * @param {object} [record={}] Initial data used to construct the data object. The provided object
         * will be owned by the constructed model instance and may be mutated.
         * @param {DataValidationOptions} [options={}] Options which affect DataModel construction
         * @param {Document} [options.parent] A parent DataModel instance to which this DataModel belongs
         */
        constructor(record?: object, options?: DataValidationOptions & { parent?: Document });

        /**
         * Initialize the source data for the DataModel.
         * @param {object} record The initial data object.
         * @param {DataValidationOptions} [options={}] Options which affect DataModel construction.
         * @returns {object} The initialized data object.
         */
        protected _initializeSource(record: object, options?: DataValidationOptions): object;

        /**
         * Migrate old data to the new format.
         * @param {object} record The data to migrate.
         * @returns {object} The migrated data.
         */
        static migrateDataSafe(record: object): object;

        /**
         * Clean the data in the new format.
         * @param {object} record The data to clean.
         * @returns {object} The cleaned data.
         */
        static cleanData(record: object): object;

        /**
         * Apply shims which preserve backwards compatibility.
         * @param {object} record The data to shim.
         * @returns {object} The shimmed data.
         */
        static shimData(record: object): object;
      }
    }
    export namespace fields {
      /**
         * An abstract class that defines the base pattern for a data field within a data schema.
         * @abstract
         */
      export class DataField {
        name: string;
        parent?: DataField;

        constructor(options?: DataFieldOptions, context?: DataFieldContext);

        /**
         * Clean the provided value according to the field's requirements.
         * @param value The value to clean.
         * @param options Additional options for cleaning.
         */
        _cleanType(value: any, options?: DataFieldOptions): any;

        /**
         * Cast the provided value to the appropriate type for this field.
         * @param value The value to cast.
         */
        _cast(value: any): any;

        /**
         * Validate the provided value according to the field's requirements.
         * @param value The value to validate.
         * @param options Additional options for validation.
         */
        _validateType(value: any, options?: DataValidationOptions): boolean;

        /**
         * Initialize the field with the provided value.
         * @param value The value to initialize.
         * @param model The data model containing this field.
         * @param options Additional options for initialization.
         */
        initialize(value: any, model: foundry.data.abstract.DataModel, options?: DataFieldOptions): void;

        /**
         * Convert the field's value to a plain object.
         * @param value The value to convert.
         */
        toObject(value: any): any;

        /**
         * Apply a function to the field's value.
         * @param fn The function to apply.
         * @param dataToApply The data to apply the function to.
         * @param options Additional options for applying the function.
         */
        apply(fn: Function, dataToApply: any, options?: DataFieldOptions): any;
      }
    }
  }

  export namespace applications {
    // Add relevant application types here
  }

  export namespace audio {
    // Add relevant audio types here
  }

  export namespace canvas {
    // Add relevant canvas types here
  }

  export namespace helpers {
    // Add relevant helper types here
  }

  export namespace dice {
    // Add relevant dice types here
  }

  export namespace config {
    export interface ReleaseData {
      // Define the structure of ReleaseData here
    }
  }

  export namespace utils {
    export class Color {
      // Define the structure of Color here
    }

    export class Collection {
      // Define the structure of Collection here
    }
  }

  export namespace prosemirror {
    // Add relevant ProseMirror types here
  }

  export namespace grid {
    // Add relevant grid types here
  }

  export namespace documents {
    // Add relevant document types here
  }

  export namespace packages {
    // Add relevant package types here
  }
}

declare class ApplicationV2 extends EventEmitterMixin(Object) {
  /**
   * Creates an instance of ApplicationV2.
   * 
   * @param options - The options for the application.
   */
  constructor(options?: ApplicationV2.Options);

  /**
   * Renders the application.
   * 
   * @param force - Whether to force rendering.
   * @param options - Additional rendering options.
   */
  render(force?: boolean, options?: ApplicationV2.RenderOptions): void;

  /**
   * Closes the application.
   */
  close(): Promise<void>;

  /**
   * Sets the position of the application.
   * 
   * @param position - The new position.
   */
  setPosition(position?: Partial<ApplicationV2.Position>): void;

  /**
   * Activates the listeners for the application.
   * 
   * @param html - The HTML element.
   */
  activateListeners(html: JQuery): void;

  /**
   * Gets the data for the application.
   * 
   * @returns The data.
   */
  getData(): Promise<ApplicationV2.Data>;

  /**
   * Handles the drop event.
   * 
   * @param event - The drop event.
   */
  _onDrop(event: DragEvent): void;

  /**
   * Handles the drag start event.
   * 
   * @param event - The drag start event.
   */
  _onDragStart(event: DragEvent): void;

  /**
   * Handles the drag over event.
   * 
   * @param event - The drag over event.
   */
  _onDragOver(event: DragEvent): void;

  /**
   * Handles the drag leave event.
   * 
   * @param event - The drag leave event.
   */
  _onDragLeave(event: DragEvent): void;

  /**
   * Handles the drag end event.
   * 
   * @param event - The drag end event.
   */
  _onDragEnd(event: DragEvent): void;

  /**
   * Handles the drop event.
   * 
   * @param event - The drop event.
   */
  _onDrop(event: DragEvent): void;
}

declare namespace ApplicationV2 {
  /**
   * Options for the ApplicationV2 class.
   */
  interface Options {
    width?: number;
    height?: number;
    top?: number;
    left?: number;
    resizable?: boolean;
    draggable?: boolean;
    title?: string;
  }

  /**
   * Options for rendering the application.
   */
  interface RenderOptions {
    force?: boolean;
    [key: string]: any;
  }

  interface Position {
    top: number;
    left: number;
    width: number;
    height: number;
  }

  interface Data {
    title: string;
    [key: string]: any;
  }
}

declare class SocketInterface {
  /**
   * Emit an event to the server.
   * @param event The event name.
   * @param args The arguments to send with the event.
   */
  emit(event: string, ...args: any[]): void;

  /**
   * Register an event listener for a specific event.
   * @param event The event name.
   * @param callback The callback function to execute when the event is received.
   */
  on(event: string, callback: (...args: any[]) => void): void;

  /**
   * Remove an event listener for a specific event.
   * @param event The event name.
   * @param callback The callback function to remove.
   */
  off(event: string, callback: (...args: any[]) => void): void;

  /**
   * Remove all event listeners for a specific event.
   * @param event The event name.
   */
  offAny(event: string): void;
}

/**
 * A helper class which assists with localization and string translation
 * @param {string} serverLanguage       The default language configuration setting for the server
 */
declare class Localization {
  /**
   * The target language for localization
   * @type {string}
   */
  lang: string;

  /**
   * The package authorized to provide default language configurations
   * @type {string}
   */
  defaultModule: string;

  /**
   * The translation dictionary for the target language
   * @type {Object}
   */
  translations: Record<string, string>;

  /**
   * Fallback translations if the target keys are not found
   * @type {Object}
   */
  _fallback: Record<string, string>;

  // /**
  //  * Cached store of Intl.ListFormat instances.
  //  * @type {Record<string, Intl.ListFormat>}
  //  */
  // #formatters: Record<string, Intl.ListFormat>;

  /**
   * Initialize the Localization module
   * Discover available language translations and apply the current language setting
   * @returns {Promise<void>}      A Promise which resolves once languages are initialized
   */
  initialize(): Promise<void>;

  /**
   * Set a language as the active translation source for the session
   * @param {string} lang       A language string in CONFIG.supportedLanguages
   * @returns {Promise<void>}   A Promise which resolves once the translations for the requested language are ready
   */
  setLanguage(lang: string): Promise<void>;

  /**
   * Discover the available supported languages from the set of packages which are provided
   * @returns {object}         The resulting configuration of supported languages
   * @private
   */
  _discoverSupportedLanguages(): Record<string, string>;

  /**
   * Prepare the dictionary of translation strings for the requested language
   * @param {string} lang         The language for which to load translations
   * @returns {Promise<object>}   The retrieved translations object
   * @private
   */
  _getTranslations(lang: string): Promise<Record<string, string>>;

  // /**
  //  * Localize the "label" and "hint" properties for all fields in a data schema.
  //  * @param {SchemaField} schema
  //  * @param {string[]} prefixes
  //  * @param {object} [options]
  //  * @param {string} [options.prefixPath]
  //  */
  // static #localizeSchema(schema: SchemaField, prefixes?: string[], options?: { prefixPath?: string }): void;

  // /**
  //  * Perform one-time localization of data model definitions which localizes their label and hint properties.
  //  */
  // static #localizeDataModels(): void;

  /**
   * Localize a string by its key
   * @param {string} key       The translation key to localize
   * @param {object} [data]    Optional data to replace within the localized string
   * @returns {string}         The localized string
   */
  localize(key: string, data?: Record<string, any>): string;
}
