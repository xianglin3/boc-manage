/**
 * Created by nantian on 2016/11/1.
 */
$(document).ready(function () {
    $(".form_datetime").datetimepicker({
        format: "yyyy-MM-dd",
        language: 'zh-CN',
        autoclose: true,
        todayBtn: true,
        pickerPosition: "bottom-left",
        minuteStep:1440,
        minView:2

    });
})


$(document).ready(function () {
    $("#time_2_ecc").change(
        function () {
            var time_2_ecc = $(this).val();
            $.ajax({
                    type: 'POST',
                    url: '/office_tool/get_exstaff_2_ecc_by_day/',
                    data: {
                        "time_2_ecc": time_2_ecc,
                    },
                    timeout: 180000,
                    success: function (data) {
                        var infocollection = data;
                        console.log(data);
                        var staff = data["staffs"]
                        var company = data["companies"]
                        var staff_comapy = $('#staff_comapy').empty();
                        staff_comapy.html("<h2>当日进入ECC的人员如下</h2>"+"<br>"+"公司："+company +"<br>"+ "外部人员：" + staff);
                        //var infocollection_str = data['infocollection_str'];
                        //
                        //var tabStr = '';
                        //var paneStr = '';
                        //for (var key in infocollection) {
                        //    var paneContentStr = '';
                        //    var value_dict = infocollection[key];
                        //    var output_array = value_dict.output;
                        //    if (value_dict.hostname == null){
                        //        hostname = "null";
                        //        }
                        //    else {
                        //        hostname = value_dict.hostname.replace('<', '');
                        //    }
                        //
                        //    tabStr = tabStr + ' <li><a href="#ip' + key.replace(new RegExp("[.]", "gm"), '_') + '" data-toggle="tab">' + hostname + '_' + key + '</a>' + '</li>';
                        //    $.each(output_array, function (n, value) {
                        //        paneContentStr = paneContentStr + value['output'];
                        //    });
                        //
                        //    paneStr = paneStr + '<div class="tab-pane fade" id="ip' + key.replace(new RegExp("[.]", "gm"), '_') + '">' + '<pre>' + paneContentStr + '</pre>' + '</div>';
                        //}
                        //tabStr = '<ul class="nav nav-tabs">' + tabStr + '</ul>';
                        //paneStr = ' <div class="tab-content">' + paneStr + '</div>';
                        //
                        //var dwonloadlogs = '<div style="display:none"> <textarea id="infocollection_str"  >' + data['infocollection_str'] + '</textarea></div>';
                        //var $infocollectionresult = $('#infocollectionresult').empty();
                        //
                        //$infocollectionresult.html(tabStr + paneStr + dwonloadlogs);
                        //$('.preloader').addClass('hidden')
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log("error 无法返回某日进入ECC人员名单");
                    },
                    dataType: 'json'
                });
        }
    );
})


