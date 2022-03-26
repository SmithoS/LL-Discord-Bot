# 引数によって呼び出すオプションを指定
If($Args -eq "up"){
    $prm = "up -d --build"
}ElseIf($Args -eq "down"){
    $prm = "down"
}ElseIf($Args -eq "ps"){
    $prm = "ps"
}Else{
    $prm = ""
}

# オプションが見つかればコマンド実行
If($prm -ne ""){
    $cmd = "docker-compose $prm"
    echo $cmd
    invoke-expression $cmd
}

