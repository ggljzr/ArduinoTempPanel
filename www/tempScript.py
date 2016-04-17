#!/usr/bit/python
# script for logging temperatures with time stamps into a file

import sys
import time

sys.path.insert(0, '/usr/lib/python2.7/bridge')

from bridgeclient import BridgeClient

client = BridgeClient()

logBuffer = []
logBufferMaxLen = 24


def writeBufferToFile():
    logFile = open('tempLog.log', 'w')
    for entry in logBuffer:
        logFile.write(entry + '\n')
    logFile.close()

while True:
    timeStruct = time.localtime(time.time())

    # write into log every hour
    if timeStruct[4] == 0:
        val = client.get('temp')
        currentTime = time.strftime('%H:%M%:%S', timeStruct)
        entry = currentTime + ' ' + val
        logBuffer.append(entry)

        if len(logBuffer) > logBufferMaxLen:
            logBuffer.pop(0)

        writeBufferToFile()

        time.sleep(1)
