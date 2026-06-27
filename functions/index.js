import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

// Generate image function
export const generateImage = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { prompt, style, aspectRatio, count } = data;

  try {
    // Call Manus image generation API
    const response = await fetch('https://api.manus.im/image-generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        style,
        aspectRatio,
        count
      })
    });

    const result = await response.json();

    // Save to Firestore
    const imageDoc = {
      userId,
      prompt,
      style,
      aspectRatio,
      imageUrl: result.imageUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      metadata: result.metadata || {}
    };

    const docRef = await db.collection('generatedImages').add(imageDoc);

    return {
      success: true,
      imageId: docRef.id,
      ...imageDoc
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate image');
  }
});

// Get user images function
export const getUserImages = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { limit = 12, offset = 0 } = data;

  try {
    const snapshot = await db.collection('generatedImages')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit + 1)
      .offset(offset)
      .get();

    const images = [];
    snapshot.forEach(doc => {
      images.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()
      });
    });

    return {
      images,
      hasMore: images.length > limit,
      total: snapshot.size
    };
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new functions.https.HttpsError('internal', 'Failed to fetch images');
  }
});

// Delete image function
export const deleteImage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { imageId } = data;

  try {
    const imageDoc = await db.collection('generatedImages').doc(imageId).get();

    if (!imageDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Image not found');
    }

    if (imageDoc.data().userId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'You can only delete your own images');
    }

    await db.collection('generatedImages').doc(imageId).delete();

    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete image');
  }
});
