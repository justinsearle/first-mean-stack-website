import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

//create our validator function for our mime type when uploading images
export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {

  //check for string value
  if (typeof(control.value) === 'string') {
    return of(null); //quick easy easy to return observable
  }

  const file = control.value as File;
  const fileReader = new FileReader();
  const frObservable = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener("loadend", () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header = "";
        let isValid = false;
        //loop the array buffer of 8 bit unsigned integers (0-255)
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16); //converts to hex
        }
        //check for a valid signature
        switch (header) {
          case "89504e47": //.png
            isValid = true;
            break;
          case "ffd8ffe0": //.jpeg | .jpg
          case "ffd8ffe1": //.jpg
          case "ffd8ffe2": //.jpeg
          case "ffd8ffe3": ///jpeg
          case "ffd8ffe8": //.jpg
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      });
      //start the process by reading the file as an array buffer (will trigger loadend)
      fileReader.readAsArrayBuffer(file);
  });
  return frObservable; //return the observable from the validator
};
