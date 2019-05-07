import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { SkillService } from './skill.service';
import { ISkill } from './Skill';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html'
})
export class SkillComponent implements OnInit {

  title: string = 'Habilidades'
  errorMessage: string
  skills: ISkill[] = []
  filteredSkills: ISkill[]
  _listFilter: string = ''

  get listFilter(): string {
    return this._listFilter
  }

  set listFilter(value: string) {
    this._listFilter = value
    this.filteredSkills = this.listFilter ? this.performFilter(this.listFilter) : this.skills
  }

  constructor(private skillService: SkillService, private toastr: ToastrService) { }

  ngOnInit() {
    this.skillService.getSkills().subscribe(
      skills => {
        this.skills = skills
        this.filteredSkills = this.skills
      },
      error => this.errorMessage = <any>error
    )
  }

  performFilter(filterBy: string): ISkill[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.skills.filter((skill: ISkill) =>
      skill.nome.toLocaleLowerCase().indexOf(filterBy) !== -1)
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Sucesso!');
  }

  showError(msg) {
    this.toastr.error(msg, 'Ops! Algo está errado!');
  }

}
