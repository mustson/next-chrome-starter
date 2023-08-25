import Cursor from "../mongo/models/Cursor";

export async function getLastProcessedCursorFor(screenname) {
  const cursorDocument = await Cursor.findOne({ screenname });
  if (cursorDocument) {
    return cursorDocument.cursor;
  }
  return null; // If not found.
}

export async function storeLastProcessedCursorFor(screenname, cursorValue) {
  // Guard clause: If cursorValue is not valid, exit early.
  if (!cursorValue) {
    console.warn(
      `Attempted to store an invalid cursor for screenname: ${screenname}`
    );
    return;
  }

  const existingCursor = await Cursor.findOne({ screenname });

  if (existingCursor) {
    // If a cursor exists for this screenname, update it.
    existingCursor.cursor = cursorValue;
    await existingCursor.save();
  } else {
    // If no cursor exists for this screenname, create a new one.
    const newCursor = new Cursor({
      screenname,
      cursor: cursorValue,
    });
    await newCursor.save();
  }
}
