import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math
import tensorflow
cap = cv2.VideoCapture(0)
detector = HandDetector(maxHands=1)
classifier = Classifier("keras_model.h5", "labels.txt")
offset = 20
imgSize = 300

folder = "Data/Y"
counter = 0

labels = ["S", "T", "U", "V", "W", "X", "Y"]

Run = True

class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.video.set(3, 1000)
        self.video.set(4, 800)

    def __del__(self):
        self.video.release()
    def get_frame(self):
        ret, frame = self.video.read()
        frame = cv2.flip(frame, 1)
        frame = fun(frame)
        ret, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()

def fun(img):
    while Run:
        imgOutput = img.copy()
        hands, img = detector.findHands(img)
        if hands:
            hand = hands[0]
            x, y, w, h = hand['bbox']

            imgWhite = np.ones((imgSize, imgSize, 3), np.uint8)*255
            imgCrop = img[y-offset:y+h+offset, x-offset:x+w+offset]

            aspectRatio = h/w

            if aspectRatio > 1:
                k = imgSize/h
                wCal = math.ceil(k*w)
                imgResize = cv2.resize(imgCrop, (wCal, imgSize))
                imgResizeShape = imgResize.shape
                wGap = math.ceil((imgSize-wCal)/2)
                imgWhite[:, wGap:wCal+wGap] = imgResize
                prediction, index = classifier.getPrediction(imgWhite)
                print(prediction, index)
            else:
                k = imgSize / w
                hCal = math.ceil(k * h)
                imgResize = cv2.resize(imgCrop, (imgSize, hCal))
                imgResizeShape = imgResize.shape
                hGap = math.ceil((imgSize - hCal) / 2)
                imgWhite[hGap:hCal + hGap, :] = imgResize
                prediction, index = classifier.getPrediction(imgWhite)
                print(prediction, index)

            cv2.putText(imgOutput, labels[index], (x, y-20), cv2.FONT_HERSHEY_COMPLEX, 2, (255, 0, 255), 2)
            # cv2.imshow("ImageCrop", imgCrop)
            # cv2.imshow("ImageWhite", imgWhite)
        # cv2.imshow("Image", imgOutput)
        cv2.waitKey(1)
        key = cv2.waitKey(1)
        return imgOutput



