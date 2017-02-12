!macro customInstall
  DetailPrint "Register myprotocol URI Handler"
  DeleteRegKey HKCR "myprotocol"
  WriteRegStr HKCR "myprotocol" "" "URL:myprotocol"
  WriteRegStr HKCR "myprotocol" "URL Protocol" ""
  WriteRegStr HKCR "myprotocol\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "myprotocol\shell" "" ""
  WriteRegStr HKCR "myprotocol\shell\Open" "" ""
  WriteRegStr HKCR "myprotocol\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend