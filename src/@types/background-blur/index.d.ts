// TypeScript Version: 2.3

/// <reference types="jquery" />

interface BackgroundBlurOptions {
  /**
   *  URL to the image
   */
  imageURL?: string;
  /**
   *  Amount of blurrines
   */
  blurAmount?: number;
  /**
   *   CSS class that will be applied to the image and to the SVG element,
   */
  imageClass?: string;
  /**
   *    CSS class of the element that will overlay the blur image
   */
  overlayClass?: string;
  /**
   *   If the image needs to be faded in, how long should that take
   */
  duration?: boolean | number;
  /**
   *   Specify the final opacity
   */
  opacity?: number;

  endOpacity?: number;

  fadeIn?: number;

}

interface JQuery {
  /**
   * Creates a new backgroundBlur with the specified or default options
   *
   * @param options Override default options
   */
  backgroundBlur(options?: BackgroundBlurOptions): JQuery;

  backgroundBlur(img: string): JQuery;
}
