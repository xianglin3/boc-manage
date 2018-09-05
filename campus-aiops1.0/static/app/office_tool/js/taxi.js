/**
 * Created by nantian on 2016/11/1.
 */
$(document).ready(function () {
    $(".form_datetime").datetimepicker({
        format: "yyyy-MM-dd hh:ii",
        language: 'zh-CN',
        autoclose: true,
        todayBtn: true,
        pickerPosition: "bottom-left",
        minuteStep: 1

    });
})


$(document).ready(function () {
    $("#money").change(
        function () {
            var money = $(this).val();
            if (money >50){
               alert("大额打车票，请输入发票号后8位");
                $("#sn").val("");
            }else{
                $("#sn").val("50以内无需填写");
            }

        }
    );
})


