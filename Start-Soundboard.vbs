Option Explicit

Dim shell, fileSystem, projectDirectory, nodeProbe, nodeOutput, nodeExecutable
Dim serverUrl, pageUrl, processEnvironment, command

Set shell = CreateObject("WScript.Shell")
Set fileSystem = CreateObject("Scripting.FileSystemObject")
projectDirectory = fileSystem.GetParentFolderName(WScript.ScriptFullName)
serverUrl = "http://127.0.0.1:3000/api/sounds"
pageUrl = "http://127.0.0.1:3000"

Set nodeProbe = shell.Exec("cmd.exe /d /s /c where node")
nodeOutput = Replace(Trim(nodeProbe.StdOut.ReadAll), vbCr, "")
If Len(nodeOutput) = 0 Then
  MsgBox "Node.js 20 or newer must be installed and available on PATH.", vbExclamation, "Room Tone Soundboard"
  WScript.Quit 1
End If
nodeExecutable = Split(nodeOutput, vbLf)(0)
shell.CurrentDirectory = projectDirectory

If Not IsSoundboardRunning(serverUrl) Then
  Set processEnvironment = shell.Environment("PROCESS")
  processEnvironment("PORT") = "3000"
  command = Chr(34) & nodeExecutable & Chr(34) & " server.js"
  shell.Run command, 0, False
  WScript.Sleep 1800
End If

If IsSoundboardRunning(serverUrl) Then
  shell.Run pageUrl, 1, False
Else
  MsgBox "Soundboard could not start. Run npm install in the project folder and try again.", vbExclamation, "Room Tone Soundboard"
End If

Function IsSoundboardRunning(url)
  Dim request
  On Error Resume Next
  Set request = CreateObject("MSXML2.ServerXMLHTTP.6.0")
  request.setTimeouts 300, 300, 300, 800
  request.Open "GET", url, False
  request.Send
  IsSoundboardRunning = (Err.Number = 0 And request.Status = 200)
  Err.Clear
  On Error GoTo 0
End Function
