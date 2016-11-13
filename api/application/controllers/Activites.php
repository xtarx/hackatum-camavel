<?php defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';

class Activites extends REST_Controller
{

    public function __construct()
    {
        parent::__construct();
        header("Access-Control-Allow-Origin: *");

        $this->load->model('activities/activities_model');
        $this->load->model('activities/activity_locations_model');
        $this->load->model('activities/activity_memebers_model');
        $this->load->model('activities/activity_types_model');
        $this->load->model('activities/activity_todos_model');
        $this->load->model('activities/activity_images_model');
        $this->load->model('account/users_fb_model');

    }

    public function add_post()
    {
        $user_id = is_authorized();

        $message = array(
            'creator_id'    => $user_id,
            'title'         => $this->post('title'),
            'type'          => $this->post('type'),
            // 'meeting_time'  => $this->post('meeting_time'),
            'meeting_point' => $this->post('destination'),
            'start_date'    => $this->post('start_date'),
            'end_date'      => $this->post('end_date'),

            'description'   => $this->post('description'),
            'agenda'        => $this->post('agenda'),

            'price'         => $this->post('price'),
            'vacancies'     => $this->post('vacancies'),

        );

        $activity_id = $this->activities_model->insert($message);

        if ($activity_id) {

            //set images to activity_id
            $uploaded_files = ($this->post('uploaded_files'));
            if ($uploaded_files) {
                // $uploaded_files = substr($uploaded_files, 1, -1);
                // $uploaded_files = explode(",", $uploaded_files);

                foreach ($uploaded_files as $key => $file_id) {

                    $response = $this->activity_images_model->update($file_id, array('activity_id' => $activity_id));

                }

            }
            $this->response(array('id' => $activity_id, 'success' => true), 200); // 200 being the HTTP response code
        } else {
            $this->response(null, 404);
        }

    }

    public function get_types_get()
    {

        $response = $this->activity_types_model->get_all();

        if ($response) {

            $this->response($response, 200); // 200 being the HTTP response code
        } else {
            $this->response(null, 404);
        }

    }
    public function get_all_get()
    {

        // $user_id = is_authorized();

        // echo "useridis " . $user_id;
        $activities = $this->activities_model->get_all();

        foreach ($activities as $key => $act) {
            $all[] = $this->activities_model->get_full_details($act['id']);

        }
        if ($activities) {

            $this->response($all, 200); // 200 being the HTTP response code
        } else {
            $this->response(null, 404);
        }

    }

    public function get_get($id)
    {

        $activity = $this->activities_model->get_full_details($id);

        if ($activity) {

            $this->response($activity, 200); // 200 being the HTTP response code
        } else {
            $this->response(null, 404);
        }

    }

    public function do_upload_post()
    {
        $user_id = is_authorized();

        $config['upload_path']   = './uploads/';
        $config['allowed_types'] = 'gif|jpg|png';
        // $config['max_size']      = 100;
        // $config['max_width']     = 1024;
        // $config['max_height']    = 768;

        $this->load->library('upload', $config);

        if (!$this->upload->do_upload('userfile')) {
            // $error = array('error' => $this->upload->display_errors());
            // print_r($error);
            $this->response(null, 404);
        } else {
            // $data = array('upload_data' => $this->upload->data());
            // print_r($data);
            $upload_data = $this->upload->data();
            $image_id    = $this->activity_images_model->insert(array('user_id' => $user_id, 'file_name' => $upload_data['file_name']));

            $this->response($image_id, 200);
        }
    }

}
