<?php defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';

class Users extends REST_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('account/users_fb_model');

    }

    public function add_post()
    {

        $message = array(
            'facebook_id'           => ($this->post('facebook_id')),
            'facebook_access_token' => ($this->post('facebook_access_token')),
            'email'                 => $this->post('email'),
            'first_name'            => $this->post('first_name'),
            'last_name'             => $this->post('last_name'),
            'profile_picture_url'   => $this->post('profile_picture_url'),
        );

        $user_exists = $this->users_fb_model->get_by(array('facebook_id' => $this->post('facebook_id')));

        if ($user_exists) {
            $message['user_id'] = $user_exists['id'];
        } else {

            $user_id            = $this->users_fb_model->insert($message);
            $message['user_id'] = $user_id;

        }
        if ($message['user_id']) {

            $message['picture'] = array('data' => array('url' => $message['profile_picture_url']));
            $message['success'] = true;

            $this->response($message, 200); // 200 being the HTTP response code
        } else {
            $this->response(null, 404);
        }

    }

}
