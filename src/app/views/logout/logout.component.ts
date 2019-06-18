import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private toastr: ToastrService, private location: Location) { }

  ngOnInit() {

    if (confirm(`Deseja realmente sair da aplicação? Clique 'OK' para sair ou 'Cancelar' para permanecer.`)) {
      localStorage.removeItem('token')
      localStorage.removeItem("nome_usuario");
      localStorage.removeItem("email_usuario");
      localStorage.removeItem("perfil_usuario");
      localStorage.removeItem("id_usuario");
      this.router.navigate(['/login'])
      this.toastr.success('Até a próxima!', 'Sessão encerrada!');
    }
    else
      this.location.back()
  }

}
