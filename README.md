# hover-to-zoom

A Javascript object to add a hover on zoom feature to images.

## How to Use

Wrap the target image in a div.  Create a HoverZoom object, passing in a jQuery reference to the parent div as the first parameter.

By default, the view window over the original image will be set to 200px X 150px and the zoom level will be set to the ratio between the image size on the page and the source image resolution.  You can manually set these values by passing in a second, optional object-type parameter when creating the HoverZoom object.  This configuration object can have any of the properties viewHeight, viewWidth, and zoom.
