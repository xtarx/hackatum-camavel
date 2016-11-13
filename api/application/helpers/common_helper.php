<?php

if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

/*
 * @author XtarX
 * @author ahmedmahmoudit
 * @package helper.common
 */

function is_authorized()
{
    // return 666;
    $CI = &get_instance();
    $CI->load->model('account/users_fb_model');

    if ($CI->input->get_request_header('Authorization')) {
        if (strpos(strtolower($CI->input->get_request_header('Authorization')), 'basic') === 0) {

            list($email) = explode(':', base64_decode(substr($CI->input->get_request_header('Authorization'), 6)));
        }
        // echo "a7a";

        $response = $CI->users_fb_model->get_by(array('facebook_id' => $email));

    } else {

        $cook  = $CI->input->get_request_header('Cookie');
        $input = $cook;
        preg_match('~%22%3A%22(.*?)%22%3A%22~', $input, $output);

        $res   = explode("%22%2C%2", $output[1]);
        $email = urldecode($res[0]);

        // echo($email);
        $response = $CI->users_fb_model->get_by(array('email' => $email));

    }

    if ($response) {
        return $response['id'];
    }
    return false;

}

if (!function_exists('sendmail')) {

    function sendmail($to, $subject, $message)
    {
        $CI = get_instance();

        $CI->load->library('email');
        $CI->email->from(FROM_MAIL, FROM_NAME);
        $CI->email->to($to);
        $CI->email->subject($subject);
        $CI->email->message($message);
        $CI->email->send();

    }
}

if (!function_exists('generate_token')) {
    /**
     * This method is used to Generate Token.
     * @method generate_token
     * @return {String} Generated token.
     *
     */
    function generate_token()
    {
        // $token = md5(uniqid() . microtime() . rand());
        // return $token;
        return uniqid();
    }
}
