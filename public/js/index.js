

$(function() {

    var $loginBox = $('#loginBox');
    var $registerBox = $('#registerBox');
    var $userInfo = $('#userInfo');

    //切换到注册面板
    $loginBox.find('a.colMint').on('click', function() {
        $registerBox.slideDown(300);
        $loginBox.slideUp(300);
    });

    //切换到登录面板
    $registerBox.find('a.colMint').on('click', function() {
        $loginBox.slideDown(300);
        $registerBox.slideUp(300);
    });

    //注册
    $registerBox.find('button').on('click', function() {
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: $registerBox.find('[name="username"]').val(),
                password: $registerBox.find('[name="password"]').val(),
                repassword:  $registerBox.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function(result) {
                $registerBox.find('.colWarning').html(result.message);

                if (!result.code) {
                    //注册成功
                    setTimeout(function() {
                        $loginBox.show();
                        $registerBox.hide();
                    }, 1000);
                }

            }
        });
    });

	//登录
    $(window).on('keyup', function (e) {
        if (e.keyCode == 13) {
            loginGo();
        }
    })
    $loginBox.find('button').click(() => {
        loginGo();
    })
	function loginGo(){
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $loginBox.find('[name="username"]').val(),
                password: $loginBox.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function(result) {

                $loginBox.find('.colWarning').html(result.message);

                if (!result.code) {
                    //登录成功
                    window.location.reload();
                }
            }
        })
    }
	$('.registerNow').on('click', function(){
        $loginBox.find('input').val('');
    })

    //退出
    $('.logout').on('click', function() {
        $.ajax({
            url: '/api/user/logout',
            success: function(result) {
                if (!result.code) {
                    window.location.reload();
                }
            }
        });
    })

     // 分类栏fixed
     $(window).resize(function() {
        $('.mainRight')[0].style.left = $('.mainLeft').offset().left + 780 + 'px';
    });
    $('.mainRight')[0].style.left = $('.mainRight').offset().left + 'px';
    $(window).on('scroll', () => {
        if($(this).scrollTop() >= 225){
            $('nav')[0].style.position = 'fixed';
            $('.mainRight')[0].style.position = 'fixed';
            $('.clear')[0].style.paddingTop = '57px';
        }else{
            $('nav')[0].style.position = '';
            $('.mainRight')[0].style.position = '';
            $('.clear')[0].style.paddingTop = '0';
        }
    })

    // 点击回到顶部
    $(".fixed_toTop").click(function() {
		$('html, body').animate({ scrollTop: 0 }, 'fast');
    });
    $(window).on('scroll', () => {
        if($(this).scrollTop() >= 225){
            $(".fixed_toTop").fadeIn(500);
        }else{
            $(".fixed_toTop").fadeOut(500);
        }
    })

})