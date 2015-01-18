## Lob Coding Challenge


A coding project for my application to Lob.

### Specifications


* Build an API that converts a PDF into an array of thumbnails (one for each page) and then responds with URLs for each generated thumbnail. 


* One PNG thumbnail for each page of the PDF input


* Each thumbnail should be served with the format <name>_thumb_<page_number>.png
i.e. You can view the created thumbnails by going to http://localhost:8000/thumbs/<file_name>


* Response:
array of objects that have a name and url key
i.e. [{ name: “myupload”, url: ‘http://localhost:8000/thumbs/myupload_thumb_page_1.png’}]


### API

#### GET /thumbs/:filename.pdf

Return a list of .png files with associated name

```json
  { 
    "page_01.png": "http://localhost:8000/page_01.png",
    "page_02.png": "http://localhost:8000/page_02.png" 
  }
```
#### GET /thumbs/:filename.png

Return a a single png img that was created via POST request.

#### POST /thumbs/upload/:filename

Where :filename is a PDF.  This endpoint will create a new local directory (instead of a database) that contains *n* .png images where *n* is the number of pages in the PDF.  The PDF file must be within this root directory.


#### Dependencies

You must have [Imagemagick]("http://www.imagemagick.org/") and [Pdftk]("https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/") command line tools installed on your local machine.
